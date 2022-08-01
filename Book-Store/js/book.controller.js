'use strict'
function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    onPriceRange()
}

function renderBooks() {
    var books = getBooksForDisplay()
    var strHTMLs = books.map(book =>
        `
        <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}</td>
            <td><img onerror="this.src='img/colorful.png'" src="img/${book.imgUrl}" alt="book img"></td>
            <td><table class="actions-container">
                <tr>
                    <td><button class="read-btn" onclick="onReadBook('${book.id}')">Read</button></td>
                    <td><button class="update-btn" onclick="onUpdateBook('${book.id}')">Update</button></td>
                    <td><button class="delete-btn" onclick="onRemoveBook('${book.id}')">Delete</button></td>
                </tr>
            </table></td> 
            <td>
                    <label class="rating-label" onclick="onRateBook(event , '${book.id}')">
                        <input
                          name="book-rate${book.id}"
                          class="rating"
                          max="5"
                          style="--value:${book.rate}"
                          oninput="this.style.setProperty('--value', this.value)"
                          step="0.5"
                          type="range">
                      </label>
                </td>
        </tr>

    `
    )
    document.querySelector('.books-container').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onAddBook() {
    const bookName = prompt('Enter book name:')
    const bookPrice = prompt('Enter book price:')
    if (bookName && bookPrice) {
        const book = addBook(bookName, bookPrice)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    const newPrice = +prompt('Enter new price:')
    if (newPrice && newPrice !== book.price) {
        book = updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${book.price}`)
    }
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onRateBook(ev, bookId) {
    ev.preventDefault()
    const elRate = document.querySelector(`[name=book-rate${bookId}]`)
    const book = setRateByBook(bookId, +elRate.value)
    flashMsg(`Rate updated to ${book.rate}`)
}

function onSearchBook(ev) {
    ev.preventDefault()
    const elBookName = document.querySelector('[name=book-name]')
    OnSetFilter({ bookName: elBookName.value })
    renderBooks()
}

function onPriceRange() {
    const rangeInput = document.querySelectorAll('.range-input input')
    const priceInput = document.querySelectorAll('.price-input input')

    const progress = document.querySelector('.slider .progress')
    const priceGap = 10
    rangeInput.forEach(input => {
        input.addEventListener("input", e => {
            //getting two ranges value and parsing them to number
            var minVal = parseInt(rangeInput[0].value)
            var maxVal = parseInt(rangeInput[1].value)
            if (maxVal - minVal < priceGap) {
                if (e.target.className === 'range-min') { //if active slider is min slider
                    rangeInput[0].value = maxVal - priceGap
                } else {
                    rangeInput[1].value = minVal + priceGap
                }
            } else {
                priceInput[0].value = minVal
                priceInput[1].value = maxVal
                progress.style.left = (minVal / rangeInput[0].max) * 100 + '%'
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%'
            }
        })
    })
    const filterBy = { minPrice: priceInput[0].value, maxPrice: priceInput[1].value }
    onSetFilter(filterBy)
    renderBooks()
}

function onPriceInput() {
    const rangeInput = document.querySelectorAll('.range-input input')
    const priceInput = document.querySelectorAll('.price-input input')
    const progress = document.querySelector('.slider .progress')
    const priceGap = 10
    priceInput.forEach(input => {
        input.addEventListener('input', e => {
            //getting two input value and parsing them to number
            var minVal = parseInt(priceInput[0].value)
            var maxVal = parseInt(priceInput[1].value)
            if ((maxVal - minVal >= priceGap) && maxVal <= 300) {
                if (e.target.className === 'input-min') { //if active input is min input
                    rangeInput[0].value = minVal
                    progress.style.left = (minVal / rangeInput[0].max) * 100 + '%'
                } else {
                    rangeInput[1].value = maxVal
                    progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%'
                }
            }
        })
        
    })
    
    
    const filterBy = { minPrice: priceInput[0].value, maxPrice: priceInput[1].value }
    console.log('OnPriceInput:', filterBy)
    onSetFilter(filterBy)
    renderBooks()
}

// function onPriceRange() {
//     console.log('onPriceRange')
//     const rangeInput = document.querySelectorAll('.range-input input')
//     const priceInput = document.querySelectorAll('.price-input input')
//     const progress = document.querySelector('.slider .progress')
//     const priceGap = 10
//     rangeInput.forEach(input => {
//         input.addEventListener("input", e => {
//             //getting two ranges value and parsing them to number
//             var minVal = parseInt(rangeInput[0].value)
//             var maxVal = parseInt(rangeInput[1].value)
//             if (maxVal - minVal < priceGap) {
//                 if (e.target.className === 'range-min') { //if active slider is min slider
//                     rangeInput[0].value = maxVal - priceGap
//                 } else {
//                     rangeInput[1].value = minVal + priceGap
//                 }
//             } else {
//                 priceInput[0].value = minVal
//                 priceInput[1].value = maxVal
//                 progress.style.left = (minVal / rangeInput[0].max) * 100 + '%'
//                 progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%'
//             }
//         })
//     })
//     priceInput.forEach(input => {
//         input.addEventListener("input", e => {
//             //getting two input value and parsing them to number
//             var minVal = parseInt(priceInput[0].value)
//             var maxVal = parseInt(priceInput[1].value)
//             if ((maxVal - minVal >= priceGap) && maxVal <= 300) {
//                 if (e.target.className === 'input-min') { //if active input is min input
//                     rangeInput[0].value = minVal
//                     progress.style.left = (minVal / rangeInput[0].max) * 100 + '%'
//                 } else {
//                     rangeInput[1].value = maxVal
//                     progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%'
//                 }
//             }
//         })
//     })
//     const filterBy = {minPrice:priceInput[0].value , maxPrice:priceInput[1].value}
//     OnSetFilter(filterBy)
//     renderBooks()
// }

function onSetFilter(filterBy) {
    console.log('OnSetFilter', filterBy)
    setBookFilter(filterBy)
    filterBy = getFullFilter()
    const queryStringParams = `?minPrice=${filterBy.minPrice}&maxPrice=${filterBy.maxPrice}&bookName=${filterBy.bookName}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        minPrice: +queryStringParams.get('minPrice') || 25,
        maxPrice: +queryStringParams.get('maxPrice') || 100,
        bookName: queryStringParams.get('bookName') || '',
    }

    if (!filterBy.minPrice && !filterBy.maxPrice && !filterBy.bookName) return

    const rangeInput = document.querySelectorAll('.range-input input')
    const progress = document.querySelector('.slider .progress')

    rangeInput[0].value = filterBy.minPrice
    progress.style.left = (filterBy.minPrice / rangeInput[0].max) * 100 + '%'
    rangeInput[1].value = filterBy.maxPrice
    progress.style.right = 100 - (filterBy.maxPrice / rangeInput[1].max) * 100 + '%'
    document.querySelector('.input-min').value = filterBy.minPrice

    document.querySelector('.input-max').value = filterBy.maxPrice

    document.querySelector('[name=book-name]').value = filterBy.bookName
    setBookFilter(filterBy)
}