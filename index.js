class Book {
    constructor(title,author){
        this.title = title;
        this.author = author;
    }
 }

 class BookService{
    static url = 'https://640a646065d3a01f98fe2fcf.mockapi.io/books';

    static getAllBooks(){
        return $.get(this.url);
    }
    static getBook(id){
        return $.get(this.url + `/${id}`);
    }
    static createBook(book){
        return $.post(this.url, book)
    }
    static updateBook(book){
        return $.ajax({
            url: this.url + `/${book.id}`,
            dataType:'json',
            data: JSON.stringify(book),
            contentType:'application/json',
            type:'PUT'
        });
    }
    static deleteBook(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type:'DELETE'
        });
    }
}

class DOMManager{
    static books;

    static getAllBooks(){
        BookService.getAllBooks().then(books => this.render(books));
    }

    static createBook(author, title){
        BookService.createBook(new Book(author,title))
        .then(() => {
            return BookService.getAllBooks();
        })
        .then((books) => this.render(books));
    }

    static deleteBook(id){
        BookService.deleteBook(id)
        .then(() => {
            return BookService.getAllBooks();
        })
        .then((books) => this.render(books));
    }



    static render(books){
      this.books = books;
      $('#app').empty();
      for(let book of books){
        $('#app').prepend(`
            <div id="${book.id}" class="card">
                <div class="card-header">
                    <h2>${book.title}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteBook('${book.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                        <h4>${book.author}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <br>`
            );
        }
    }
}
$("#create-new-book").click(() => {
    DOMManager.createBook($("#new-book-title").val(),$("#new-book-author").val());
    $("#new-book-title").val("");
    $("#new-book-author").val("");
});

DOMManager.getAllBooks();