//fetching data by each file, since many browsers don't support import/export
//The data are taken from this google sheet - https://docs.google.com/spreadsheets/d/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/edit#gid=0
//And the data are fetched using this link - https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json

//calling the main funtion
topMoviesPageMain();



//Now initializing the atributes using fetched data
async function topMoviesPageMain()
{

	//first I have to fetch the data
	var dataSheet =  await fetching();

	//since I only need the enties
	dataSheet = dataSheet.feed.entry;

	//convert the coma separated genre values to an array
	dataSheet = convertGenre(dataSheet);

	//getting the list of top movies
	var topMovies = getTopMovies(dataSheet);

	//creating the movie cards
	createMovieCards(topMovies,'topList',topMovies.length);

	//setting event listener to the cards
	setCards();

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

function getTopMovies(data) {

	var array = [];
	
	for(var i=0;i<data.length;i++)
	{
		if(data[i].gsx$topmovie.$t == 'TRUE')
			array.push(data[i]);
	}

	return array;
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
