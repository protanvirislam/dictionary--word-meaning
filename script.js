//DOM Selection
const search_btn = document.querySelector(".btn-search");
const input_value = document.querySelector("#word-value");
const word_container = document.querySelector(".details-container");

//Lottie Animation Initialization
function renderLottie() {
  const animation = lottie.loadAnimation({
    container: word_container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./lottie/Animation - 1745413454699.json", // path to your local file
  });
}

renderLottie();
//Fetch Data by Submitting Word

async function FetchData(e) {
  //e.preventDefault()
  let word = input_value.value.trim()

  console.log(word)

  try {
    if (!word) {
      throw new Error("Please fill the input with correct Word");
    }

    let res = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );

    if (!res.ok) {
      throw new Error("You Provided Wrong Word Which is not in dictionary :(");
    }

    let data = await res.json();
    //Clear Input Value
    input_value.value = "";

    //Render Data Function Called on Each Data Submit
    if (!data) {
      throw new Error("No Data Available For this Word :(");
    }
    RenderData(data);
  } catch (err) {
    let html = `
      <div class="alert alert-dismissible alert-danger">
  
  <strong>Oh snap!</strong> ${err.message} and try submitting again.
</div>
      `;
    word_container.insertAdjacentHTML("beforebegin", html);
    //clear input field
    input_value.value = "";
  //Alert Remove After 5 sec
    setTimeout(()=> {
     document.querySelector(".alert-danger").remove()
    }, 5000)
  }
}

//Render Data  on Every Fetch

function RenderData(data) {
  word_container.innerHTML = "";
  console.log(data);

  data.forEach((obj) => {
    const li = document.createElement("li");

    li.innerHTML = ` <!-- Main Word with Parts of Speech -->
         
        <div class="word">
          <span class="main-word">${obj.word}</span>
          <span class="pos">${obj.meanings[0].partOfSpeech}</span>
        </div>

        <!-- Phonetic with voice -->
       <div class="word-voice">
        <audio controls >
          <source src="${obj.phonetics.length === 0 ? "" : obj.phonetics[0].audio}" type="audio/mpeg">
          Your Browser Doesn't Support Audio Element
         </audio>
         <div class="phonetic">${obj.phonetic??obj.word}</div>
       </div>

       <!-- Meaning Of the Main Word -->
        <div class="word-meaning">
          <h4>Meaning :</h4> <p>
           ${obj.meanings[0].definitions[0].definition}
          </p>
        </div>


        <!-- Synonym -->
         <div class="word-synonym">
          <h4>Synonym:</h4>
          <div class="word-synonym-list">
            
          </div>
         </div>
      `;
    word_container.insertAdjacentElement("afterbegin", li);

    if (obj.meanings[0].synonyms.length === 0) {
      document
        .querySelector(".word-synonym-list")
        .insertAdjacentHTML("afterbegin", `<p>Nothing Found !</p>`);
    } else {
      obj.meanings[0].synonyms.forEach((syn) => {
        {
          document
            .querySelector(".word-synonym-list")
            .insertAdjacentHTML("afterbegin", `<span>${syn}</span>`);
        }
      });
    }
  });
}

//Event Handling
search_btn.addEventListener("click", FetchData);
