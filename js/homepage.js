// Getting the elements from HTML
const carousel = document.getElementById('carousel');
const size = carousel.children.length;

//fetching data by each file, since many browsers don't support import/export
//The data are taken from this google sheet - https://docs.google.com/spreadsheets/d/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/edit#gid=0
//And the data are fetched using this link - https://spreadsheets.google.com/feeds/list/1vnKwmmsSAnZKvp_B1aGO3OcEXAQ1NMiuLv3yn-m9qPg/od6/public/values?alt=json

//calling the main function
homePageMain();




//Now initializing the atributes using fetched data
async function homePageMain()
{
	//first I have to fetch the data
	var dataSheet = await fetching();

	//since I only need the enties
	dataSheet = dataSheet.feed.entry;

	//sorting the data according to year
	//the carousel will show the latest 5 movies 
	var yearSortedData =  sortData(dataSheet);

	//convert the coma separated genre values to an array
	yearSortedData = convertGenre(yearSortedData);

	//getting the latest 5 movies from the sorted data
	var carouselData = getLatestData(yearSortedData,5);

	//setting the attributes of the html carousel elements
	carouselInit(carouselData);

	//since initialy the slider is on the postion of the last clone
	gotoFirst();

	//starting the autoplay 
	setInterval(autoPlay, 2500);
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
	
	var len = data.length;
	for(var i=0;i<len;i++)
	{
		data[i].gsx$genre.$t = data[i].gsx$genre.$t.split(', ');
	}
	return data;
}


function getLatestData(data,max)
{
	var latest = [];

	latest[0]=data[max-1];//keeping the clone of last data
	for(var i=0;i<max;i++)
	{
		latest[i+1]=data[i];
	}
	latest[max+1]=data[0];//keeping the clone of first data

	return latest;
}

function carouselInit(data) {
	
	for(i=0;i<size;i++)
	{
		var cItem = carousel.children[i]; //selecting the carousel item
		cItem.querySelector('img').src="images/Movies/BannerImage/" + data[i].gsx$photo.$t;
		cItem.querySelector('.name').textContent=data[i].gsx$name.$t;
		cItem.querySelector('.genre').textContent=data[i].gsx$genre.$t[0];
	}
}

//initializilng done;


function autoPlay()
{
	//continiously move to the next slide
	gotoNext();
}

function gotoFirst()
{
	//takes the slider straight to the first image, without any sliding effect to create the loop
	carouselCounter=1;
	carousel.classList.add('noTransition');
	carousel.style.transform = 'translateX(-100vw)';
}

function gotoLast()
{
	//takes the slider straight to the last image, without any sliding effect to create the loop
	carouselCounter=size-2;
	carousel.classList.add('noTransition');
	carousel.style.transform += 'translateX(-' + (size-2)*100 + 'vw)';
}


function gotoNext() {
	// Does the transition to the next slide
	if(carouselCounter>=size-1)//this condition is for handing errors of counter
		return;

	//the class that was added by gotofirst()/gotolast()
	carousel.classList.remove('noTransition');
	carouselCounter++;
	carousel.style.transform = 'translateX(-' + carouselCounter*100 + 'vw)';
	if(carouselCounter==size-1)checkIf();//checking if the current slide is a clone one
}

function gotoPrev() {
	// Does the transition to the next slide

	if(carouselCounter<=0)//this condition is for handing errors of counter
		return;

	//the class that was added by gotofirst()/gotolast()
	carousel.classList.remove('noTransition');
	carouselCounter--;
	carousel.style.transform = 'translateX(-' + carouselCounter*100 + 'vw)';
	if(carouselCounter==0)checkIf();//checking if the current slide is a clone one
}

function checkIf()
{
	carousel.addEventListener('transitionend',function()
	{
		if(carousel.children[carouselCounter].id=="firstClone")
		{
			gotoFirst();//to create the loop effect
		}
		else if(carousel.children[carouselCounter].id=="lastClone")
		{
			gotoLast();//to create the loop effect
		}
	});
}