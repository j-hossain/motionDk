//fetching data by each file, since many browsers don't support import/export
//The data are taken from this google sheet - https://docs.google.com/spreadsheets/d/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/edit#gid=0
//And the data are fetched using this link - https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json

//html elements
const genreListDiv = document.getElementById('genreList');

//calling the main funtion
moviesPageMain();




//Now initializing the atributes using fetched data
async function moviesPageMain()
{

	//first I have to fetch the data
	var dataSheet =  await fetching();


	//since I only need the enties
	dataSheet = dataSheet.feed.entry;

	//sorting the data according to year
	var yearSortedData =  sortData(dataSheet);

	//convert the coma separated genre values to an array
	dataSheet = convertGenre(dataSheet);

	//getting the set of unique genres from the data sheet
	var genreList = createGenreList(dataSheet);

	//initializing the genreList in html
	genreListInit(genreList);

	//creating the movie cards for genre wise list
	createMovieCards(dataSheet,'completeList',dataSheet.length);

	//creating the cards of recomended movies [latest 5 movies]
	createMovieCards(yearSortedData,'recomendList',3)

	//initialing with drama genre
	filterList(dataSheet,'drama',genreListDiv);

	//setting event listener to the cards
	setCards();

	//gets the genre to be filterd
	getTarget(dataSheet);
}

async function fetching () {
	//this function fetches the api from google sheet as json 

	const response = await fetch('https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json');
	var dataSheet = await response.json();
	return dataSheet;
}


function sortData (data) {
	// this function sorts the fetched data using bubble sort 
	var temp;
	var size = data.length;
	var sortedData = data;
	for(var i=0;i<size-1;i++)
	{
		for(var j=i;j<size;j++)
		{
			// if the year of current index is smaller than the compared index -> swap them
			if(sortedData[i].gsx$year.$t<sortedData[j].gsx$year.$t)
			{
				temp = sortedData[i];
				sortedData[i] = sortedData[j];
				sortedData[j] = temp; 
			}
		}
	}
	return sortedData;
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

function createGenreList(data) {
	
	var list = [];//this array contains the name of all genres from the spreadsheet

	for(var i=0;i<data.length;i++)
	{
		var genreSize = data[i].gsx$genre.$t.length;

		for(var j=0;j<genreSize;j++)
		{
			if(notIncluded(data[i].gsx$genre.$t[j],list))//checking if the genre is already in the list
				list.push(data[i].gsx$genre.$t[j]);
		}
	}
	return list;

}

function notIncluded(string, array) {

	//searches for the given string in the array

	for(var i=0;i<array.length;i++)
	{
		if(array[i]==string)
			return 0;
	}

	return 1;
}

function genreListInit(list) {
	
	//getting the main div for genre list
	const genreDiv = document.querySelector('#genreList');

	for(var i=0;i<list.length;i++)
	{
		//creating the span of genre
		var genre = document.createElement('span');
		genreDiv.appendChild(genre);
		genre.textContent = list[i];
		genre.id = list[i];
		genre.classList.add('genreName');

	}
}

function createMovieCards(data,div,length) {
	
	//getting the main div where the cards will be appended
	const movieList = document.querySelector('#'+div+' .movieList');

	for(i=0;i<length;i++)
	{
		createCard(data[i],movieList,div);
	}
}

function createCard(data,parent,div) {
	
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
	var dname = document.createElement('span');
	dname.textContent = data.gsx$director.$t;
	dname.classList.add('dname');
	dname.title = 'Director'

	//appending the elements to its parent
	parent.appendChild(card);
	card.appendChild(link);
	link.appendChild(image);
	link.appendChild(title);
	title.appendChild(name);
	title.appendChild(dname);

	if(div == 'recomendList' )//no classlist needed for the genre list, since it is not going to be filtered
		return ;
	addGenreClasses(card,data.gsx$genre.$t);
}

function addGenreClasses (element,list) {
	
	for(var i=0;i<list.length;i++)
	{
		element.classList.add(list[i]);
	}
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

function getTarget(dataSheet) {
	
	genreSize = genreListDiv.children.length;

	
	for(var i=0;i<genreSize;i++)
	{
		genreListDiv.children[i].addEventListener('click',function(){

			var target = this.getAttribute('id');
			filterList(dataSheet,target,genreListDiv);
		});
	} 
}

function filterList(dataSheet,target,parent)
{
	for(var i=0;i<parent.children.length;i++)
	{
		parent.children[i].classList.remove('active');
		if(parent.children[i].id==target)
			parent.children[i].classList.add('active');

	} 
	const compDiv = document.querySelector('#completeList .movieList');//getting the div of complete movies list
	const listTitle = document.querySelector('#completeList .listTitle');//getting the title of complte movie list
	const bannerTitle = document.querySelector('#banner .title span');//getting the title of the banner
	const bannerImage = document.querySelector('#banner img');//getting the image of the banner
	
	listTitle.textContent=target;
	bannerTitle.textContent=target;

	for(var i=0;i<dataSheet.length;i++)
	{
		var genreSize = dataSheet[i].gsx$genre.$t.length;
		for(var j=0;j<genreSize;j++)
		if(dataSheet[i].gsx$genre.$t[j]==target)
		{
			bannerImage.src = '../images/Movies/BannerImage/'+ dataSheet[i].gsx$photo.$t;
		}
	}

	hide(compDiv);

	var compShow = compDiv.querySelectorAll('.'+target);

	show(compShow);

}

function hide(div) {
	var divSize = div.children.length;

	for(var i=0;i<divSize;i++)
	{
		div.children[i].style.position = 'absolute';
		div.children[i].style.opacity = '0';
		div.children[i].style.width = '0%';

	}
}

function show(div) {
	var divSize = div.length;

	for(var i=0;i<divSize;i++)
	{
		div[i].style.position = 'relative';
		div[i].style.width = '100%';
		div[i].style.opacity = '1';
	}
}


