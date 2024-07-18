// laodCategories                                                                         
const laodCategories = async () => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/news/categories')
        const data = await res.json();
        // console.log(data.data.news_category)
        return data.data.news_category;
    } catch (error) {
        console.log(error)
    }
}



// ------------- show all the categories in UI  -------------------
const setAllCategory = async () => {
    const categories = await laodCategories()
    //   console.log(categories)

    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.textContent = ''

    loadCategoriesNumber('01', categories[0].category_name);

    categories.forEach((singleCategory) => {
        // console.log(singleCategory)
        // const {category_id, category_name} = singleCategory;
        // console.log(category_id,category_name)

        const menu = document.createElement('a')
        menu.innerHTML = `
    
    <div class="p-2 cursor-pointer"  href="" onclick="loadCategoriesNumber('${singleCategory.category_id}', '${singleCategory.category_name}')">${singleCategory.category_name}</div>
    `
        categoriesContainer.appendChild(menu)



    })
}
setAllCategory()


// -------------- how many items available  ------
const loadCategoriesNumber = async (id, name) => {
loadSpinner(true)

    // now its time to fetch (https://openapi.programming-hero.com/api/news/category/01 this ) catagory  item
    const url = (`https://openapi.programming-hero.com/api/news/category/${id}`)
    try {
        const res = await fetch(url);
        const data = await res.json();
        // console.log(data.data.length, name)
        return numberOfAvailableNews(data.data, name)

    } catch (error) {
        console.log(error)
    }

}


// how many items are availabile on particular news 

const numberOfAvailableNews = (data, name) => {
    const numberOfNewsContainer = document.getElementById('number-of-news');
    // How many news available in each catagory 
    numberOfNewsContainer.innerHTML = `
        <p> ${data.length} items found for  ${name} </p>
    `;


    //sorting 
    data.sort((a, b) => b.total_view - a.total_view);

    // show news in UI 
    const newsContainer = document.getElementById('news-container')
    newsContainer.innerHTML = ''
    data.forEach((news) => {
        // console.log(news)
        const newsDiv = document.createElement('div')
        newsDiv.innerHTML = `
        
        
        <div class="card w-11/12 mx-auto lg:card-side bg-base-100 p-5 shadow-xl mt-7 mb-24">
        <figure><img src="${news.thumbnail_url}" alt="Album"></figure>
        <div class="card-body">
          <h2 class="card-title">${news.title}</h2>
          <p>${news.details.length > 20
                ? news.details.slice(0, 200)
                : news.details
            }</p>
        <p>${news.details.length > 20
                ? news.details.slice(201, 400) + ' .....'
                : news.details
            }</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center text-center mt-3">

              <div class="flex  justify-center items-center gap-4  mt-4">
                  <div class="">
                    <img src="${news.author.img}" style="width: 50px" class="w-100 rounded-full" alt="">
                  </div>
                  <div>
                    <p>${news.author.name === "system" || news.author.name === "null" ? 'not found' : news.author.name}</p>
                    <p>${news.author.published_date === "null" ? 'not found' : news.author.published_date}</p>
                  </div>
              </div>

              <div class="flex gap-4 justify-center items-center mt-4">
                <div><img src="./images/carbon_view.png" alt=""></div>
                <div><p>${news.total_view ? news.total_view + 'M' : 'Views Not Found'}</p></div>
              </div>
              <div class="flex justify-center mt-5">
                 <div onclick="loadModal('${news._id}')"> <label for="my-modal-3" class=" modal-button"><img src="./images/bi_arrow-right-short.png" alt=""></label> </div>
              </div>

          </div>
        </div>
      </div>
        
        `;
        newsContainer.appendChild(newsDiv)
loadSpinner(false)


    })


}

// modal 

const loadModal = async (id) => {
    const url = (`https://openapi.programming-hero.com/api/news/${id}`)
    try {
        const res = await fetch(url)
        const data = await res.json()
        // console.log(data)
        showModal(data.data[0])
    }catch (error){
        console.log(error)
    }


}

const showModal = (data) =>{
    console.log(data)
    const newsDetail = document.getElementById('news-detail')
    newsDetail.innerHTML = ''
    newsDetail.innerHTML= `
    
    <figure>
        <img src="${data.image_url}" alt="">
      </figure>
    <h3 class="text-lg font-bold">${data.title}</h3>
    <p class="py-4">${data.details}</p>
    <div id="author-details">
      <div>
        <p>Author: <span class="text-orange-400">${data.author.name}</span></p>
        <img src="${data.author.img}" style="width: 50px" class=" rounded-full" alt="">
      </div>
      <div>
        <p>Published on: <span class="text-orange-500">${data.author.published_date}</span></p>
      </div>
      <div class="flex gap-2">
      <p> views:  </p><img src="./images/carbon_view.png" alt="">${data.total_view}M 
      </div>
    </div>
    `
}

// spinner 

const loadSpinner = (isLoading) =>{
    const spinner = document.getElementById('spinner')
    if(isLoading){
        spinner.classList.remove('hidden')
    }else{
        spinner.classList.add('hidden')
    }

}



