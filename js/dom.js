const UNCOMPLETED_READ_ID = 'belumDibaca';
const COMPLETED_READ_ID = 'telahDibaca';
const BOOK_ITEM_ID = "itemId";

function addBook() {

    // Mengambil nilai data buku dari form input
    const inputJudulBuku = document.getElementById("inputJudulBuku").value;
    const inputPenulisBuku = document.getElementById("inputPenulisBuku").value;
    const inputTahunBuku = document.getElementById("inputTahunBuku").value;
    const inputDibaca = document.getElementById("dibaca").checked;

    // Menampilkan data buku yang ditambahkan, ke console
    console.log("Judul: " + inputJudulBuku);
    console.log("Penulis: " + inputPenulisBuku);
    console.log("Tahun: "+ inputTahunBuku);
    console.log("Selesai Dibaca: "+ inputDibaca);

    const book = inputBook(inputJudulBuku, inputPenulisBuku, inputTahunBuku, inputDibaca);
    const bookObject = composeBookObject(inputJudulBuku, inputPenulisBuku, inputTahunBuku, inputDibaca);
  
    book[BOOK_ITEM_ID] = bookObject.id;
    books.push(bookObject);

    if(inputDibaca){
        document.getElementById(COMPLETED_READ_ID).append(book);
    } else {
        document.getElementById(UNCOMPLETED_READ_ID).append(book);
    }
    updateDataToStorage();
}

function inputBook(inputJudul, inputPenulis, inputTahun, inputDibaca){
    // Merangkai elemen judul buku
    const judulBuku = document.createElement('h3');
    judulBuku.classList.add('book-title');
    judulBuku.innerText = inputJudul;

    // Merangkai elemen penulis buku
    const penulisBuku = document.createElement('p');
    penulisBuku.classList.add('book-details');
    penulisBuku.innerText = inputPenulis;

    // Merangkai elemen tahun terbit buku
    const tahunBuku = document.createElement('p');
    tahunBuku.classList.add('book-details');
    tahunBuku.innerText = inputTahun;

    // Merangkai elemen daftar buku dan menambahkan tombol didalamnya
    const buttons = document.createElement('div');
    buttons.classList.add('book-buttons');
    buttons.append(greenButton(inputDibaca));
    buttons.append(orangeButton());
    buttons.append(redButton());

    // Membuat elemen data buku menjadi satu
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-card');
    bookContainer.append(judulBuku, penulisBuku, tahunBuku, buttons);

    return bookContainer;
};

function createButton(buttonType, buttonText, eventListener){

    // Membentuk elemen tombol dan karakteristik masing masing tombol
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonType);
    button.addEventListener("click", function (event) {
        eventListener(event); 
    });
    return button;
}

function greenButton(status) {
    // Membuat tombol hapus dengan event
    // undoBookFromCompleted() / addBookToCompleted() menyesuaikan kondisi
    return createButton('green-button', (status ? 'Belum Selesai' : 'Selesai'), function(event) {
        if(status) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
        } else {
            addBookToCompleted(event.target.parentElement.parentElement);
    }
    });
}

function orangeButton() {
    // Membuat tombol hapus dengan event 'editBook()'
    return createButton('orange-button', 'Edit', function(event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function redButton() {
    // Membuat tombol hapus dengan event 'removeBook()'
    return createButton('red-button', 'Hapus', function(event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

// Memindahkan buku ke rak sudah dibaca
function addBookToCompleted(taskElement) {
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = true;

    // Membuat data buku baru
    const newBook = inputBook(book.judul, book.penulis, book.tahun, inputDibaca=true);
    newBook[BOOK_ITEM_ID] = book.id;

    // Menambahkan buku kedalam rak sudah dibaca
    const bookCompleted = document.getElementById(COMPLETED_READ_ID);
    bookCompleted.append(newBook);

    // Menghapus buku dari rak
    taskElement.remove();
    updateDataToStorage();
}

// Menampilkan tab edit dan data data buku
// dijalankan apabila tombol edit pada buku ditekan
function editBook(taskElement) {
    const edit = document.querySelector('.edit-section');
    edit.removeAttribute("hidden");

    const book = findBook(taskElement[BOOK_ITEM_ID]);

    // Menampilkan data buku pada form edit
    const editJudulBuku = document.getElementById("editJudulBuku");
    editJudulBuku.value = book.judul;
    const editPenulisBuku = document.getElementById("editPenulisBuku");
    editPenulisBuku.value = book.penulis;
    const editTahunBuku = document.getElementById("editTahunBuku");
    editTahunBuku.value = book.tahun;
    const editDibaca = document.getElementById("editBaca");
    editDibaca.checked = book.isCompleted;

    const submitEdit = document.getElementById('edit-submit');
    submitEdit.addEventListener('click', function(event) {

        // Memasukan data baru pada buku yang diedit
        updateEditBook(editJudulBuku.value, editPenulisBuku.value, editTahunBuku.value, editDibaca.checked, book.id);

        // Menutup tab edit ketika selesai edit buku
        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    });
}

// Fungsi untuk mengupdate data buku di local storage
function updateEditBook(judul, penulis, tahun, dibaca, id) {

    // Mengambil data pada local storage dan dikonversi dari String menjadi Objek
    const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
    const bookIndex = findBookIndex(id);

    // Membentuk data baru pada buku
    bookStorage[bookIndex] = {
        id: id,
        judul: judul,
        penulis: penulis,
        tahun: tahun,
        isCompleted: dibaca
    };

    // Mengkonversi data menjadi String dan memasukan data baru pada local storage
    const parsed = JSON.stringify(bookStorage);
    localStorage.setItem(STORAGE_KEY, parsed);

    // Reload halaman setelah data diubah
    location.reload(true);
}

// Menghapus buku dari rak buku
function removeBook(taskElement) {
    const hapus = confirm('Yakin ingin menghapus buku?');
    if(hapus) {

        // Mencari index buku yang dipilih dan menghapus datanya
        const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
        books.splice(bookPosition, 1);

        // Menghapus buku dari rak
        taskElement.remove();
        updateDataToStorage();
    }
}

// Mengembalikan buku ke rak belum dibaca
function undoBookFromCompleted(taskElement){
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = false;

    // Membuat data buku baru
    const newBook = inputBook(book.judul, book.penulis, book.tahun, book.isCompleted);
    newBook[BOOK_ITEM_ID] = book.id;

    // Menambahkan buku ke rak belum dibaca
    const uncompletedRead = document.getElementById(UNCOMPLETED_READ_ID);
    uncompletedRead.append(newBook);

    // Menghapus buku lama dari rak
    taskElement.remove();
    updateDataToStorage();
}

// Fungsi untuk mencari buku
function searchBook(keyword) {
    const bookList = document.querySelectorAll('.book-card');
    for(let book of bookList){
        const judul = book.childNodes[0];
        if(!judul.innerText.toLowerCase().includes(keyword)){
            // Set display 'none' pada buku apabila judul tidak menganduk keyword yang dicari
            judul.parentElement.style.display = 'none';
        } else {
            // Menampilkan buku apabila mengandung keyword
            judul.parentElement.style.display = '';
        }
    }
}