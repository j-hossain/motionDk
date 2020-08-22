//fetching data by each file, since many browsers don't support import/export
//The data are taken from this google sheet - https://docs.google.com/spreadsheets/d/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/edit#gid=0
//And the data are fetched using this link - https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json

//data variables
var dataSheet;
var yearSortedData;
var carouselData = [];

//function calls

//calling the main function
PageMain();




//Now initializing the atributes using fetched data
async function PageMain()
{

	//first I have to fetch the data
	await fetching();

	//since I only need the enties
	dataSheet = dataSheet.feed.entry;

	//sorting the data according to year
	//the carousel will show the latest 5 movies 
	yearSortedData =  sortData(dataSheet);

	//convert the coma separated genre values to an array
	yearSortedData = convertGenre(yearSortedData);
}



async function fetching () {
	//this function fetches the api from google sheet as json 

	const response = await fetch('https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json');
	dataSheet = await response.json();
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
	
	var len = data.length;
	for(var i=0;i<len;i++)
	{
		data[i].gsx$genre.$t = data[i].gsx$genre.$t.split(',');
	}
	return data;
}



// var res = await fetching('posts');

	// var content = document.createElement('div');
	// content.innerHTML = res.content.rendered;
	// var text = temp.querySelector('p');
	// console.log(text);


	// var test = document.querySelector('.news');
	// var mainDiv = document.querySelector('.newsDivs');
	// test=test.outerHTML;
	// mainDiv.innerHTML+=test;
	// console.log(mainDiv);