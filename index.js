const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')
const setuploading = document.getElementById('output-container')
const locText = document.getElementById('loc-text')
const OPENAI_API_KEY0 = process.OPENAI_API_KEY0;
const OPENAI_API_KEY1 = process.OPENAI_API_KEY1;
const OPENAI_API_KEY2 = process.OPENAI_API_KEY2;
const url = 'https://api.openai.com/v1/completions'
const url1 = 'https://api.openai.com/v1/images/generations'
const url_weather = 'https://api.openweathermap.org/data/2.5/weather?q='
const apik = process.apik;
$(window).on('load',function(){
    $("#output-container").css('display','block');
})

document.getElementById("send-btn").addEventListener("click", () => {
  var url_wea = url_weather + locText.value + "&appid=" + apik;
  fetchWether(url_wea).then((botReply) => { var we = botReply;
    
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
    var otherThings = setupTextarea.value;
    // loop thru checkboxs id=feelings-type-1, feelings-type-2 ...6 and save their value if checked into an array
    var feelings = [];
    for (var i = 1; i <= 6; i++) {
      if (document.getElementById("feelings-type-" + i).checked) {
        feelings.push(document.getElementById("feelings-type-" + i).value);
      }
    }
    var foodType = [];
    for (var i = 1; i <= 6; i++) {
      if (document.getElementById("food-type-" + i).checked) {
        foodType.push(document.getElementById("food-type-" + i).value);
      }
    }
    const rndInt = Math.floor(Math.random() * 35) + 16
    we = rndInt+'C and windy'
    console.log(foodType);
    console.log(locText.value);
    console.log(otherThings);
    console.log(feelings);
  
    var prompt =  "Generate a food suggestion based on the below feelings such as I live in "+ locText.value + " and the temperature here is "+we+" , I feel " + feelings + " and want to eat " + foodType +" food.  "+ otherThings + ".say only the name of the food dont say anything else"
  
    fetchBotReply(prompt);
    // fetchBotReply(prompt).then((botReply) => {
    //   var food = botReply;
    //   console.log(food);
    //   fetchImagePrompt(food).then((botReply) => {
    //     var img_desc = botReply;
    //     fetchImageUrl(img_desc).then(() => {
    //       console.log("Image generated");
    //     })
    //   })
    // })
  });
})

async function fetchWether(url_wea){
  fetch(url_wea).then(response => response.json()).then(data => {
    var temp = data['main']['temp'];
    var wndspd = data['wind']['speed'];
    return temp +" "+ wndspd;
  })
}

async function fetchBotReply(prompt){
  var prompttext = prompt;
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY0
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Generate feedback to enthusiastically say an outline looks interesting and that you need some minutes to think about it.
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in bengaluru  and the temperature here is 20 degrees celsius , I feel Depressed,Cold/Cough and want to eat Energizing food.  i have thyroid.say only the name of the food dont say anaything else.
        message : Quinoa Salad
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in delhi and the temperature here is 10 degrees celsius , I feel Nauseous,Sad and want to eat Comforting food.  i want high protein food.say only the name of the food dont say anything else
        message : Chicken Soup
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in gujarat and the temperature here is 34 degrees celsius , I feel Hungry,Happy and want to eat Filling food.  i want junk food.say only the name of the food dont say anything else
        message : Pav Bhaji
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in kashmir and the temperature here is 07 degrees celsius , I feel Cold/Cough and want to eat Comforting food.  i want something hot and spicy.say only the name of the food dont say anything else
        message : Kashmiri Kahwa
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in mysore and the temperature here is 29 degrees celsius , I feel Sad and want to eat Indulgent food.  ntg.say only the name of the food dont say anything else
        message : Chocolate Brownie
        ###
        outline: ${prompttext}
        message:  `,
        'max_tokens' : 100,
      })
    }).then(response => response.json()).then(data =>{
        setTimeout(function(){
          movieBossText.innerText = data.choices[0].text;
          var m = document.getElementById('movie-boss-text').textContent;
          console.log("calling recipe maker with "+m);
          document.getElementById("output-title").innerHTML = m;
          fetchRecipe(m);
        },1000)
      }
    )
  }catch (error) {
    console.error("Error:", error);
  }
}

async function fetchRecipe(food){
  var prompttext = food;
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY0
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `tell me how to cook ${prompttext} in 5 short sentences`,
        'max_tokens' : 100,
      })
    }).then(response => response.json()).then(data =>{
        setTimeout(function(){
          console.log("calling desc maker with "+food);
          document.getElementById("output-text").innerHTML = data.choices[0].text;
          console.log("Recipe is: "+data.choices[0].text);
          fetchImagePrompt(food);
        },1000)
      }
    )
  }catch (error) {
    console.error("Error:", error);
  }
}

async function fetchAPI(url, options) {
  const response = await fetch(url, options);
  if (response.status === 429) {
    // Handle rate limit by waiting and retrying the request after a delay
    const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
    await sleep(retryAfter * 1000);
    return fetchAPI(url, options); // Retry the request
  }
  return response;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImagePrompt(food) {
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY0
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `outline: Generate a appetizing description of ${food}
        message: `,
        temperature: 0.8,
        max_tokens: 100
      })
    });
    const data = await response.json();
    const imagePrompt = data.choices[0].text.trim();
    console.log("calling img maker with: "+imagePrompt);
    fetchImageUrl(imagePrompt);
    return imagePrompt;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchImageUrl(imagePrompt){
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY0}`
    },
    body: JSON.stringify({
      prompt:`${imagePrompt}. There should be no text in this image.`,
      n: 1,
      size: '512x512',
      response_format: 'b64_json'
    })
  };
  fetch(url1, requestOptions)
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${data.data[0].b64_json}">`;
      
      document.getElementById("output-desc").innerHTML = imagePrompt;
    }
  })
}