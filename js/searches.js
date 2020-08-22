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

	//setting the tilte according to the searched name
	setTitle(name);

	//first I have to fetch the data
	var dataSheet = await fetching();

	//since I only need the enties
	dataSheet = dataSheet.feed.entry;

	//convert the coma separated genre values to an array
	dataSheet = convertGenre(dataSheet);

	//getting the list of top movies
	var searchResults = getSearchResults(dataSheet,name);

	//checking if there is no result
	if(searchResults.length == 0)
		noResult();

	else
	{
		//creating the movie cards
		createMovieCards(searchResults,'searchList',searchResults.length);

		//setting event listener to the cards
		setCards();
	}
	

}

function getName () {
	
	var url = window.location;
	var usp = new URLSearchParams(url.search);

	return usp.get('name').toString();

}

function setTitle (name) {
	
	document.title = "'" + name + "'" + ' Search results - Motion';	
}

async function fetching () {
	//this function fetches the api from google sheet as json 

	const response = await fetch('https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json');
	var dataSheet = await response.json();

	return dataSheet;
}


function convertGenre(data) {
	//this function converts the coma separated values in genre feild to an array
	var len = data.length;
	for(var i=0;i<len;i++)
	{
		data[i].gsx$genre.$t = data[i].gsx$genre.$t.split(', ');//using ', ' as the separator
	}
	return data;
}

function getSearchResults(dataSheet,name) {

	var array = [];
	
	name = name.toLowerCase();

	for(var i=0;i<dataSheet.length;i++)
	{
		var temp = dataSheet[i].gsx$name.$t;
		temp = temp.toLowerCase();

		var nameMatch = temp.match(name);

		if(nameMatch != null)//if there is atleast a match
			array.push(dataSheet[i]);
	}

	return array;
}

function noResult (argument) {

	//displaying the no result notation
	document.querySelector('.noResult').style.display = 'block'; 
}

function createMovieCards(data,div,length) {
	
	//getting the main div where the cards will be appended
	const movieList = document.querySelector('#'+div+' .movieList');

	for(i=0;i<length;i++)
	{
		createCard(data[i],movieList,div);
	}
}

function createCard(data,parent) {
	
	var card = document.createElement('div');
	card.classList.add('card');
	var link = document.createElement('a');
	link.href = "#";
	var image = document.createElement('img');
	image.src = "../images/Movies/CardImage/" + data.gsx$photo.$t;
	var title = document.createElement('div');
	title.classList.add('title');
	var name = document.createElement('span');
	name.textContent = data.gsx$name.$t;
	name.classList.add('name');
	var gname = document.createElement('span');
	gname.textContent = data.gsx$genre.$t[0];
	gname.classList.add('gname');
	gname.title = 'Genre'

	//appending the elements to its parent
	parent.appendChild(card);
	card.appendChild(link);
	link.appendChild(image);
	link.appendChild(title);
	title.appendChild(name);
	title.appendChild(gname);

}


function setCards() {
	
	const cards = document.querySelectorAll('.card a');
	for(var i=0;i<cards.length;i++)
	{
		cards[i].addEventListener('click', function(){
			
			var name = this.querySelector('.name').textContent;
			var url = getMovieUrl(name);
			this.href = url;
		});
	}
}

function getMovieUrl(name) {
	
	var url = '../pages/movieDetails.html' + '?name=' + name;
	return url;

}
