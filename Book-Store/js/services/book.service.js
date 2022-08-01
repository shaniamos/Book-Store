'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5
const gImgsName = ['black', 'brown', 'green', 'white']

var gPageIdx = 0
var gBooks
var gFilterBy = { minPrice: 0, maxPrice: 100, bookName: '' }
_createBooks()

function getBooksForDisplay() {
    var books

    if (gFilterBy.bookName) {
        books = gBooks.filter(book => (gFilterBy.bookName === book.name && 
                                        gFilterBy.maxPrice &&
                                        book.price >= gFilterBy.minPrice))
    } else books = gBooks.filter(book =>
        (book.price <= gFilterBy.maxPrice && book.price >= gFilterBy.minPrice))
    return books
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function _createBook(name = 'dBookName', price = 19.90) {
    return {
        id: makeId(),
        name: name,
        price: price,
        imgUrl: `${name}.png`,
        rate: 1,
        desc: makeLorem()
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 21; i++) {
            var imgName = gImgsName[getRandomIntInclusive(0, gImgsName.length - 1)]
            books.push(_createBook(imgName))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    console.log('setBookFilter')
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.bookName !== undefined) gFilterBy.bookName = filterBy.bookName
    return gFilterBy
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setRateByBook(bookId, newRate) {
    const book = getBookById(bookId)
    book.rate = newRate
    _saveBooksToStorage()
    return book
}

function getFullFilter(){
    return gFilterBy
}