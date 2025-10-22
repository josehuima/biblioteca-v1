TRUNCATE TABLE physical_books RESTART IDENTITY CASCADE;

INSERT INTO physical_books (book_id, borrowed, return_date, user_id, curr_transaction_id)
SELECT b.id, false, NULL, 0, 0
FROM books b, generate_series(1, b.total_copies); 