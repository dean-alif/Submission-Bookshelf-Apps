
let bookshelf = [];
let render_bookshelf = "render-bookshelf_event";

document.addEventListener("DOMContentLoaded", function () {
    const formSubmit = document.getElementById("form-input-book");

    formSubmit.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (checkStorage()){
        loadDataFromStorage();
    }

});

function addBook() {
    const textBook = document.getElementById("book-title-input").value;
    const textAuthor = document.getElementById("book-author-input").value;
    const textYear = document.getElementById("book-year-input").value;

    const ID = generateId();
    const bookshelfObject = generateBookshelfObject(ID, textBook, textAuthor ,textYear ,false);
    bookshelf.push(bookshelfObject);

    document.dispatchEvent(new Event(render_bookshelf));
    updateData();
}

function generateId() {
    return +new Date();
}


function generateBookshelfObject(id, title, author ,year ,isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(render_bookshelf, function () {
    const incompleteBookList = document.getElementById("inComplete-Bookshelf-List");
    incompleteBookList.innerHTML = "";

    const completedBookList = document.getElementById("Completed-Bookshelf-List");
    completedBookList.innerHTML = "";

    for (bookItem of bookshelf){
    const bookshelfElement = makeBookshelf(bookItem);

    if (bookItem.isCompleted == false)
    incompleteBookList.append(bookshelfElement);
    else
    completedBookList.append(bookshelfElement);
}
});

function makeBookshelf(bookshelfObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookshelfObject.title;
    textTitle.classList.add("title");

    const textWriter = document.createElement("p");
    textWriter.innerText = bookshelfObject.author;

    const textPublicationYear = document.createElement("p");
    textPublicationYear.innerText = bookshelfObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("shelf-item")
    textContainer.append(textTitle, textWriter ,textPublicationYear);

    const container = document.createElement("div");
    container.classList.add("shelf-container")
    container.append(textContainer);
    container.setAttribute("id", `bookshelf-${bookshelfObject.id}`);

    if (bookshelfObject.isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            let dialogUndo = confirm("Apakah Anda Yakin Ingin Memindahkan Buku Ini Ke Rak Belum Selesai Dibaca ?");

            if (dialogUndo) {
            undoBookFromComplete(bookshelfObject.id);
            alert("Buku Dipindahkan Ke Rak Belum Selesai Dibaca");
            } else {
                alert("Buku Tidak Dipindahkan");
            }
        });
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            let dialogDelete = confirm("Apakah Anda Yakin Ingin Menghapus Buku Ini ?");

            if (dialogDelete) {
                removeBookFromBookshelf(bookshelfObject.id);
                alert("Buku Dihapus");
            } else {
                alert("Buka Tidak Dihapus");
            }
        });
        container.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            let dialogAdd = confirm("Apakah Anda Yakin Ingin Memindahkan Buku Ini Ke Rak Selesai Dibaca ?");

            if (dialogAdd) {
                addBookToComplete(bookshelfObject.id);
                alert("Buku Dipindahkan Ke Rak Selesai Dibaca");
            } else {
            alert("Buku Tidak Dipindahkan");
            }
        });
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            let dialogDelete = confirm("Apakah Anda Yakin Ingin Menghapus Buku Ini ?");

            if (dialogDelete) {
                removeBookFromBookshelf(bookshelfObject.id);
                alert("Buku Dihapus");
            } else {
                alert("Buka Tidak Dihapus");
            }
        });
        container.append(checkButton, trashButton);
    }
    return container;
}

function addBookToComplete(bookshelfId) {
    const bookTarget = findBook(bookshelfId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(render_bookshelf));
    updateData();
}

function removeBookFromBookshelf(bookshelfId) {
    const bookTarget = findBookIndex(bookshelfId);
    if (bookTarget === -1) return;

    bookshelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(render_bookshelf));
    updateData();
}

function undoBookFromComplete(bookshelfId){
    const bookTarget = findBook(bookshelfId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(render_bookshelf));
    updateData();
}

function findBook(bookshelfId){
    for (bookItem of bookshelf){
        if (bookItem.id === bookshelfId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookshelfId) {
    for (index in bookshelf){
        if (bookshelf[index].id === bookshelfId){
            return index
        }
    }
    return -1
}

function updateData() {
    if (checkStorage()){
        const parse = JSON.stringify(bookshelf);

        localStorage.setItem(storage_key, parse);
        document.dispatchEvent(new Event(saved_bookshelf));
    }
}

let saved_bookshelf = "saved-bookshelf";
let storage_key = "BOOKSHELF_APPS";

function checkStorage() {
    if (typeof(Storage) === undefined){
        alert("Browser Tidak Mendukung Local Storage");
        return false
    }
    return true;
}

document.addEventListener(saved_bookshelf, function() {
    console.log(localStorage.getItem(storage_key));
});

function loadDataFromStorage() {
    const bookshelfData = localStorage.getItem(storage_key);
    let books = JSON.parse(bookshelfData);

    if(books !== null){
        for(book of books){
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(render_bookshelf));
}

function getBookshelfData() {
    return JSON.parse(localStorage.getItem(storage_key));
}

const searchValue = document.getElementById("search-book-title");
const buttonSearch = document.querySelector("#search-Submit");

buttonSearch.addEventListener("click", function(search) {
    search.preventDefault();

    if (localStorage.getItem(storage_key) == "") {
        alert("Data Buku Tidak Ditemukan");
        return location.reload();

    } else {
        const getBookTitle = getBookshelfData().filter(a => a.title == searchValue.value.trim());

        if (getBookTitle.length == 0) {
            const getBookAuthor = getBookshelfData().filter(a => a.author == searchValue.value.trim());

            if (getBookAuthor.length == 0) {
                const getBookYear = getBookshelfData().filter(a => a.year == searchValue.value.trim());

                if (getBookYear.length == 0) {
                    alert(`Buku Tidak Ditemukan`);
                    return location.reload();

                }else{
                    searchResult(getBookYear);

                }
            }else{
                searchResult(getBookAuthor);

            }
        }else{
            searchResult(getBookTitle);
            
        }
    }

    searchResult.value = '';
})

function searchResult(render_bookshelf) {
    const showSearch = document.querySelector("#search-Result");

    showSearch.innerHTML = '';

    render_bookshelf.forEach(bookshelfObject => {
        let elementSearch = `
        <div class = "book-search-item">
            <center>
            <h2> Hasil Dari Pencarian : "${searchValue.value}" </span> </h2>
            </center>
            <p> Judul Buku : ${bookshelfObject.title} </p>
            <p> Penulis Buku : ${bookshelfObject.author} </p>
            <p> Tahun Buku : ${bookshelfObject.year} </p>
            <p> Keterangan : <span> ${bookshelfObject.isCompleted ? 'Selesai Dibaca' : 'Belum Selesai Dibaca'} </span> </p>
        </div>`

        showSearch.innerHTML += elementSearch;
    });
}