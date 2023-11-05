const baseUrl = 'http://localhost:3000';

// Step 1: Fetch and display details for the first movie
fetchMovieDetails(`${baseUrl}/films/1`)
  .catch(logError);

// Step 2: Fetch all movies, populate the film menu, and implement delete functionality
fetchMovies(`${baseUrl}/films`)
  .then(populateFilmMenu)
  .catch(logError);

// Step 3: Implement the functionality to buy a ticket
const buyTicketButton = document.getElementById('buy-ticket');
buyTicketButton.addEventListener('click', handleTicketPurchase);

// Function to fetch and display movie details
function fetchMovieDetails(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // Update the movie details on the page
      updateMovieDetails(data);
    });
}

// Function to update movie details on the page
function updateMovieDetails(data) {
  const remainingTickets = data.capacity - data.tickets_sold;
  document.getElementById('poster').src = data.poster;
  document.getElementById('title').innerText = data.title;
  document.getElementById('runtime').innerText = `${data.runtime} minutes`;
  document.getElementById('showtime').innerText = data.showtime;
  document.getElementById('ticket-num').innerText = remainingTickets;

  updateBuyTicketButton(remainingTickets);
}

// Function to update the Buy Ticket button based on ticket availability
function updateBuyTicketButton(remainingTickets) {
  const buyTicketButton = document.getElementById('buy-ticket');
  if (remainingTickets === 0) {
    buyTicketButton.innerText = 'Sold Out';
    buyTicketButton.disabled = true;
  } else {
    buyTicketButton.innerText = 'Buy Ticket';
    buyTicketButton.disabled = false;
  }
}

// Function to fetch all movies
function fetchMovies(url) {
  return fetch(url)
    .then(response => response.json());
}

// Function to populate the film menu
function populateFilmMenu(data) {
  const filmsList = document.getElementById('films');
  data.forEach(movie => {
    const li = createMovieElement(movie);
    filmsList.appendChild(li);
  });

  removeDefaultPlaceholder();
}

// Function to create a movie element for the film menu
function createMovieElement(movie) {
  const li = document.createElement('li');
  li.classList.add('film', 'item');
  li.textContent = movie.title;

  const deleteButton = createDeleteButton(movie, li);
  li.appendChild(deleteButton);

  li.addEventListener('click', () => {
    fetchMovieDetails(`${baseUrl}/films/${movie.id}`).catch(logError);
  });

  return li;
}

// Function to create a delete button for each film
function createDeleteButton(movie, li) {
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    removeMovie(`${baseUrl}/films/${movie.id}`, li).catch(logError);
  });
  return deleteButton;
}

// Function to remove a movie from the list and the server
function removeMovie(url, li) {
  return fetch(url, {
    method: 'DELETE',
  })
    .then(() => {
      li.remove();
    });
}

// Function to remove the default placeholder li element
function removeDefaultPlaceholder() {
  const placeholderElement = document.querySelector('#films .film');
  if (placeholderElement) {
    placeholderElement.remove();
  }
}

// Function to handle the ticket purchase
function handleTicketPurchase() {
  const remainingTicketsElement = document.getElementById('ticket-num');
  let remainingTickets = parseInt(remainingTicketsElement.innerText);
  if (remainingTickets > 0) {
    remainingTickets--;
    remainingTicketsElement.innerText = remainingTickets;
    const movieId = 1;
    updateTicketSales(`${baseUrl}/films/${movieId}`, remainingTickets);
  } else {
    // Handle case where tickets are sold out
    updateBuyTicketButton(0);
  }
}

// Function to update ticket sales
function updateTicketSales(url, remainingTickets) {
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: remainingTickets }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(logError);
}

// Function to log errors
function logError(error) {
  console.error('Error:', error);
}
