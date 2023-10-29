const apiKey = "9b02d708cd6b82604f66fb0953cc5eef";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

let page = 1;
let isSearching = false;

async function fetchData(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("No response");
        }
        return await response.json();
    }catch(error){
        return null;
    }
}

//fetch and show result
async function fetchAndShowResult(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
}

function createMovieCard(movie) {
    const {poster_path, title, release_date, overview} = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const truncatedTitle = title.length > 15 ? title.slice(0,15) + "..." : title;
    const formattedDate = release_date || "No release date";
    const cardTemplate = `
        <div class="column">
        <div class="card">
            <a href="${imagePath}" class="card-media">
                <img src="${imagePath}" alt="${title}" width="100%">
            </a>
            <div class="card-content">
                <div class="card-header">
                    <div class="left-content">
                        <h4>${truncatedTitle}</h4>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="right-content">
                        <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                    </div>
                </div>
                <div class="info">${overview || "No overview available"}</div>
            </div>
        </div>
    </div>
    `;
    return cardTemplate;
}

//clear previous result before new search
function clearResults() {
    result.innerHTML = "";
    page = 1;
}

function showResults(item) {
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>No result found...</p>";
}

async function loadMoreResults(){
    if(isSearching) return;
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResult(url);
}

// Detect end of page and load more results
function detectEnd() {
    
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    if(scrollTop + clientHeight >= scrollHeight) {
        console.log("Detect end");
        loadMoreResults();
    }
}

async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if(searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
    }
}

// Event listeners
form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

async function init() {
    clearResults();
    // result.innerHTML = `<h1>Trending<\h1>
    // <br>`
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
}

init();