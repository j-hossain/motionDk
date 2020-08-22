//fetching data by each file, since many browsers don't support import/export
//The data are taken from this google sheet - https://docs.google.com/spreadsheets/d/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/edit#gid=0
//And the data are fetched using this link - https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json

//calling the main funtion
topMoviesPageMain();




//Now initializing the atributes using fetched data
async function topMoviesPageMain()
{
	//getting the movie name 
	var name = getName();

	//setting the tilte according to the movie name
	setTitle(name);

	//first I have to fetch the data
	var dataSheet = await fetching();

	//since I only need the enties
	dataSheet = dataSheet.feed.entry;


	//getting the movie data
	var movieData = getMovieData(dataSheet,name);

	//Initializing the html elements
	initElements(movieData);

}

function getName () {
	
	var url = window.location;
	var usp = new URLSearchParams(url.search);

	return usp.get('name').toString();

}

function setTitle (name) {
	
	document.title = name + ' - Motion';	
}

async function fetching () {
	//this function fetches the api from google sheet as json 

	const response = await fetch('https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json');
	var dataSheet = await response.json();
	return dataSheet;
}

function getMovieData (dataSheet, name) {

	for(var i=0;i<dataSheet.length;i++)
	{
		var temp = dataSheet[i].gsx$name.$t;
		var temp = temp.match(name);

		if(temp != null) //it will ony be null if the given string does not match
			return dataSheet[i];
	}
}

function initElements (data) {
	
	document.querySelector('.quickInfo img').src = '../images/Movies/CardImage/' + data.gsx$photo.$t;

	document.querySelector('.name').innerHTML = data.gsx$name.$t;

	document.querySelector('.genres').innerHTML = data.gsx$genre.$t;

	document.querySelector('.year').innerHTML = data.gsx$year.$t;
	
	document.querySelector('.duration').innerHTML = data.gsx$runtime.$t + ' minutes';

	document.querySelector('.director .text').innerHTML = data.gsx$director.$t;

	document.querySelector('.actors .text').innerHTML = data.gsx$mainactor.$t;

	document.querySelector('.description .text').innerHTML = data.gsx$description.$t;

	if(data.gsx$review.$t=="")
	{
		document.querySelector('.review').style.display = 'none';
		document.querySelector('.reviewBy').style.display = 'none';
	}
	else
	{
		document.querySelector('.review .text').innerHTML = data.gsx$review.$t;
		document.querySelector('.reviewBy .text').innerHTML = data.gsx$reviewby.$t;
	}

	document.querySelector('.ageRating .text').innerHTML = data.gsx$agerating.$t;

}
