// TMDB 오픈 API 사이트의 내용을 가져왔습니다.
// options 변수는 fetch 요청에 대한 옵션을 정의하는 객체입니다.
// method는 GET 요청, 헤더는 'application/json'을 지정하여 JSON 형식의 응답을 요청했습니다.

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmNmMTAxZDdmZDUxMjlmYjZiZmNhMmU2YjI5OTc3MCIsInN1YiI6IjY0NzU1YjY3ZGQyNTg5MDBlMjBjNzkzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ADwxKf_vwACvN1s9ns4NDSPwRy5A6UqOBUtvfmPdC_I'
    }
};

// 영화 데이터를 가져와서 해당 데이터를 바탕으로 영화 카드를 동적으로 생성하는 기능을 구현하는 파트입니다.

// 영화 API를 호출하여 최고 평점 영화 목록을 가져오는데 앞서 설정한 options 객체를 함께 전달하여 요청을 보냅니다.
// 첫번째 then은 fetch 요청의 응답 객체를 가져와서 JSON 형식으로 변환합니다.
// 두번째 then은 변환된 응답 데이터를 처리하는 콜백 함수입니다.
// 마지막은 과정중에 발생한 오류를 콘솔에 기록하는 부분입니다.

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        // fetch 요청의 응답 데이터인 JSON 객체에서 results 속성을 추출하여 rows 변수에 할당하는 구문입니다.
        const rows = response.results;
        // HTML에서 cards-box라는 ID를 가진 요소를 가져옵니다. 이는 영화 카드를 담을 컨테이너 역할을 합니다.
        const cardsBox = document.getElementById('cards-box');

        // rows 배열을 map 메소드, 화살표 함수를 사용하여 각 영화의 정보를 가지고 HTML 문자열을 생성합니다.
        // 카드에 담길 정보인 title, overview, poster_path, vote_average과 id를 추가했습니다.
        const movieCardsHTML = rows.map(row => {
            const id = row.id;
            const title = row.title;  
            const overview = row.overview;  
            const poster_path = row.poster_path;  
            const vote_average = row.vote_average;  
            // 각 영화에 대한 정보를 가지고 영화 카드를 생성하는 HTML 문자열을 반환합니다.
            // 웹개발종합반에서 배운 템플릿 리터럴을 사용했습니다.
            return `<div class="col">
                <div class="card h-100" onclick="showMovieId(${id})">
                    <img src="https://image.tmdb.org/t/p/w500${poster_path}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${overview}</p>
                        <p class="mycomment">평점: ${vote_average}</p>
                    </div>
                </div>
            </div>`;
        });
       
        // 영화 카드들을 생성한 HTML 문자열을 컨테이너 요소의 내부 HTML로 설정하여 실제로 화면에 표시합니다.
        // join('') 메소드는 movieCardsHTML 배열의 각 요소를 빈 문자열로 구분하여 하나의 문자열로 결합합니다. 
        cardsBox.innerHTML = movieCardsHTML.join('');
    })
    .catch(err => console.error(err));

// 영화 검색을 처리하는 함수

// HTML 문서에서 id가 'url'인 요소를 찾아 해당 요소의 값을 가져오고
// 가져온 값에 대해서 공백을 제거하고 소문자로 변환한 후 searchTerm(검색어) 변수에 저장합니다.

// HTML 문서에서 class가 'card'인 모든 요소를 찾아서 cards 변수에 저장합니다.
// 이는 영화 카드를 나타내는 HTML 요소들의 집합입니다.

function searchMovies() {
    const searchTerm = document.getElementById('url').value.trim().toLowerCase();
    const cards = document.getElementsByClassName('card');

    // cards 변수에 저장된 각각의 카드 요소에 대해서 for 반복문을 수행합니다.
    // 인덱스 i가 초기값 0 부터 시작해서 카드의 길이보다 작을때까지 반복을 실행하고, 반복이 실행될 때마다 i가 1식 증가되게 설정
    // 각 카드의 제목을 가져와서 검색 용어와 비교하기 위한 준비 작업입니다.

    // 현재 반복 인덱스 i에 해당하는 cards 배열의 요소에서 클래스 이름이 'card-title'인 요소를 찾습니다.
    // 해당 클래스 이름을 가진 첫 번째 요소를 반환합니다. titleElement에 찾은 요소가 할당됩니다.
    // titleElement에 할당된 요소의 텍스트 콘텐츠를 가져와서 양쪽 공백을 제거하고, 텍스트를 소문자로 변환합니다.

    for (let i = 0; i < cards.length; i++) {
        const titleElement = cards[i].querySelector('.card-title');
        const title = titleElement.textContent.trim().toLowerCase();

        // if 조건문을 사용해 검색어와 일치하는 영화 카드만 표시하고 나머지는 숨깁니다.
        if (title.includes(searchTerm)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = 'none';
        }
    }
}

// 검색 박스를 열기 위한 함수
// open_box() 함수는 'post-box'라는 id를 가진 요소의 display 속성을 'block'으로 설정하여 
// 해당 요소를 화면에 보이도록 하는 역할을 합니다.

function open_box() {
    document.getElementById('post-box').style.display = 'block';
}

// 영화 ID를 표시하는 함수
// showMovieId(id) 함수는 영화 ID를 받아와서 해당 ID를 알림창으로 보여주는 역할을 합니다.

function showMovieId(id) {
    alert(`Movie ID: ${id}`);
}