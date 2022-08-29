// Dark Mode
let elBtn = document.querySelector(".dark__btn")
let elSun = document.querySelector(".sun__svg")
let elMoon = document.querySelector(".moon__svg")
let elLogo = document.querySelector(".book__svg")
let elLupa = document.querySelector(".lupa__svg")
let elLabel = document.querySelector(".label")
let elInputSearch = document.querySelector(".search")
let elBookWrapper = document.querySelector(".book__wrapper")

elBtn.addEventListener('click', function() {
    body.classList.toggle("dark__mode")
    elMoon.classList.toggle("d-none")
    elSun.classList.toggle("d-none")
    elLogo.classList.toggle("col__active")
    elLupa.classList.toggle("col__active")
    elLabel.classList.toggle("iput__active")
    elInputSearch.classList.toggle("iput__active")
    elBookWrapper.classList.toggle("wrapper-active")
})

// Render Book Card

let elBookTemplate = document.querySelector("#book__temp").content
let elBookmarkTemplate = document.querySelector("#bookmark__temp").content
let elModalTemplate = document.querySelector("#more__template").content
let elBookCardWrapper = document.querySelector(".book__render")
let elBookmarkWrapper = document.querySelector(".bookmarked")
let elBookResults = document.querySelector(".result")
let elBookmarkCard = document.querySelector(".bookmark__card")
let elBookCard = document.querySelector(".book__card")
let elReadBtn = document.querySelector(".book__read")
let elBookNewest = document.querySelector(".book__newest")
let elMoreWrapper = document.querySelector(".more__wrapper")

let localBook = JSON.parse(localStorage.getItem("bookmarkedBook"))

let bookmarkArray = localBook ? localBook : []
renderBookmark(localBook)

function renderBook(array) {
    elBookCardWrapper.innerHTML = null;
    
    let newFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let newBookTemp = elBookTemplate.cloneNode(true)
        
        newBookTemp.querySelector(".book__image").src = item.volumeInfo.imageLinks.thumbnail
        newBookTemp.querySelector(".book__name").textContent = item.volumeInfo.title
        newBookTemp.querySelector(".book__auth").textContent = item.volumeInfo.authors
        newBookTemp.querySelector(".book__year").textContent = item.volumeInfo.publishedDate
        newBookTemp.querySelector(".bookmark").dataset.bookmarkId = item.id
        newBookTemp.querySelector(".more__info").dataset.moreInfoId = item.id
        newBookTemp.querySelector(".book__read").dataset.readId = item.id
        newBookTemp.querySelector(".book__read").href = item.volumeInfo.previewLink
        
        newFragment.appendChild(newBookTemp);
    }
    elBookCardWrapper.appendChild(newFragment)
    elBookWrapper.classList.add("h-100", "px-4", "pt-5")
}

// Search

let elForm = document.querySelector(".form")
let inputSearch = elInputSearch

elForm.addEventListener("submit", function(evt) {
    evt.preventDefault()
    
    let newInputSearch = inputSearch.value.trim()
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${newInputSearch}`)
    .then(res => res.json())
    .then(data => {
        renderBook(data.items)
        elBookResults.textContent = data.totalItems

        newInputSearch.value = null
    })
})

// Render Bookmark
elBookCardWrapper.addEventListener("click", function(evt) {
    let bookmarkedId =  evt.target.dataset.bookmarkId;
    let moreInfoId =  evt.target.dataset.moreInfoId;
    
    if (bookmarkedId) {
        if (bookmarkArray.length == 0) {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkedId}`)
            .then(res => res.json())
            .then(data => {
                bookmarkArray.unshift(data)
                renderBookmark(bookmarkArray)
                localStorage.setItem("bookmarkedBook", JSON.stringify(bookmarkArray))
            })
        }else if(!bookmarkArray.find(item => item.id == bookmarkedId)) {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkedId}`)
            .then(res => res.json())
            .then(data => {
                bookmarkArray.unshift(data)
                localStorage.setItem("bookmarkedBook", JSON.stringify(bookmarkArray))
                renderBookmark(bookmarkArray)
            })
        }
        renderBookmark(bookmarkArray)
    }
    
    if (moreInfoId) {
        fetch(`https://www.googleapis.com/books/v1/volumes/${moreInfoId}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            renderModal(data)
        }) 
    }
})

function renderBookmark(array) {
    elBookmarkWrapper.innerHTML = null
    
    let newFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let newBookmarkTemp = elBookmarkTemplate.cloneNode(true)
        
        newBookmarkTemp.querySelector(".bookmark__name").textContent = item.volumeInfo.title
        newBookmarkTemp.querySelector(".bookmark__auth").textContent = item.volumeInfo.authors
        newBookmarkTemp.querySelector(".bookmark__read").dataset.bookmarkReadId = item.id
        newBookmarkTemp.querySelector(".bookmark__btn").href = item.volumeInfo.previewLink
        newBookmarkTemp.querySelector(".bookmark__delete").dataset.bookmarkDeleteId = item.id
        
        newFragment.appendChild(newBookmarkTemp)
    }
    elBookmarkWrapper.appendChild(newFragment)
}

elBookmarkWrapper.addEventListener("click", function(evt) {
    let foundDeleteId = evt.target.dataset.bookmarkDeleteId;
    
    if (foundDeleteId) {
        let bookmarkedMoviesId = bookmarkArray.findIndex(function(item) {
            return item.id == foundDeleteId;
        })
        
        bookmarkArray.splice(bookmarkedMoviesId, 1);
        localStorage.setItem("bookmarkedBook", JSON.stringify(bookmarkArray))
    }
    renderBookmark(bookmarkArray);
});

elBookNewest.addEventListener("click", function() {
    let newInputSearch = inputSearch.value.trim()
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${newInputSearch}&orderBy=newest`)
    .then(res => res.json())
    .then(data => {
        renderBook(data.items)

        newInputSearch.value = null
    }) 
})

// Modal More Info

function renderModal(array) {
    elMoreWrapper.innerHTML = null
    
    let newFragment = document.createDocumentFragment();
    
    let moreInfoTemp = elModalTemplate.cloneNode(true);
    
    moreInfoTemp.querySelector(".more__title").textContent = array.volumeInfo.title;
    moreInfoTemp.querySelector(".more__img").src = array.volumeInfo.imageLinks.thumbnail;
    moreInfoTemp.querySelector(".more__text").textContent = array.volumeInfo.description;
    moreInfoTemp.querySelector(".more__auth").textContent = array.volumeInfo.authors;
    moreInfoTemp.querySelector(".more__published").textContent = array.volumeInfo.publishedDate;
    moreInfoTemp.querySelector(".more__publisher").textContent = array.volumeInfo.publisher;
    moreInfoTemp.querySelector(".more__category").textContent = array.volumeInfo.categories;
    moreInfoTemp.querySelector(".more__pages").textContent = array.volumeInfo.pageCount;
    moreInfoTemp.querySelector(".more__read").href = array.volumeInfo.previewLink;
    
    newFragment.appendChild(moreInfoTemp);
    
    
    elMoreWrapper.appendChild(newFragment);
}