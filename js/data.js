const STORAGE_KEY = "BOOKSHELF_APP";
 
let books = [];

// Mengecek apakah browser mendukung local storage
function isStorageExist() {
   if(typeof(Storage) === undefined){
       alert("Browser tidak mendukung local storage");
       return false;
   }
   return true;
}
 
function saveData() {
   const parsed = JSON.stringify(books);
   localStorage.setItem(STORAGE_KEY, parsed);
   document.dispatchEvent(new Event("ondatasaved"));
}

// Mengambil seluruh data buku dari local storage dan dikonversi menjadi objek
function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null)
       books = data;
 
   document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}

// Menyusun data buku kedalam objek
function composeBookObject(judul, penulis, tahun, isCompleted) {
   return {
       id: +new Date(),
       judul,
       penulis,
       tahun,
       isCompleted
   };
}

// Mencari data buku sesuai Id
function findBook(bookId) {
   for(book of books){
       if(book.id === bookId)
           return book;
   }
   return null;
}
 
// Mencari index buku dari local storage
function findBookIndex(bookId) {
   let index = 0;
   for (book of books) {
       if(book.id === bookId)
           return index;
           
 
       index++;
   }
 
   return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_READ_ID);
    let listCompleted = document.getElementById(COMPLETED_READ_ID);
  
    for(book of books){
        const newBook = inputBook(book.judul, book.penulis, book.tahun, book.isCompleted);
        newBook[BOOK_ITEM_ID] = book.id;
  
        if(book.isCompleted){ listCompleted.append(newBook);} 
        else { listUncompleted.append(newBook); }
    }
 }