window.addEventListener('DOMContentLoaded', () => {
// tabs
const tabs = document.querySelectorAll ('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items');

      function hideTabContent () {
        tabsContent.forEach (item => {
            item.style.display = 'none';
        });
        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
      };

      function showTabContent (i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
      }
      hideTabContent();
      showTabContent();

      tabsParent.addEventListener ('click', event=>{
        const target = event.target;
        if (target && target.classList.contains ('tabheader__item')){
            tabs.forEach ((item, i ) =>{
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        };

      });
//timer

const dedline = '2024-05-22';

function getTimeRemaning (endtime) {

  const t = Date.parse(endtime)- Date.parse(new Date()),
        days = Math.floor(t/(1000*60*60*24)),
        hours = Math.floor(t/(1000*60*60)%24),
        minutes = Math.floor(t/(1000*60)%60),
        seconds = Math.floor(t/1000 % 60 );
        
  return {
    'total' : t,
    'days' : days,
    'hours' : hours,
    'minutes' : minutes,
    'seconds' : seconds
  }

}
function getZero (num) {
  if (num>0 && num<10){
    return `0${num}`;}
  else {return num}
}
function setClock (selector, endTime){

  const  timer = document.querySelector(selector),
         days = timer.querySelector('#days'),
         hours = timer.querySelector('#hours'),
         minutes = timer.querySelector('#minutes'),
         seconds = timer.querySelector('#seconds'),
         timeInterval = setInterval(updateClock, 1000)
         updateClock ()
  function updateClock (){
    const t = getTimeRemaning (endTime);

    days.innerHTML = getZero(t.days);
    hours.innerHTML = getZero(t.hours);
    minutes.innerHTML = getZero(t.minutes);
    seconds.innerHTML = getZero(t.seconds);

    if (t.total <=0){
      clearInterval(timeInterval)
    }
  }
}
     
setClock('.timer', dedline);

//modal
  const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');
        


function openModal (){
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden'
}
modalTrigger.forEach((btn) =>{
  btn.addEventListener('click', openModal);
})

function closeModal (){
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

modal.addEventListener ('click', (e) =>{
  if (e.target === modal || e.target.getAttribute ('data-close') == ''){
    closeModal()
  }
});

document.addEventListener ('keydown', (e) =>{
  if (e.code === "Escape" && modal.classList.contains('show')){
    closeModal()
  }
});

function showModalByScroll () {
  if (window.scrollY + document.documentElement.clientHeight >=document.documentElement.scrollHeight-1){
    openModal()
    window.removeEventListener('scroll', showModalByScroll)

  }
}

window.addEventListener ('scroll', showModalByScroll)


// класи для карточок 

class MenuCard {
  constructor (src, alt, title, descr, price, parentSelector, ...classes ){
    this.src = src;
    this.alt = alt;
    this.title = title;
    this.descr = descr;
    this.price = price;
    this.transfer = 38;
    this.classes = classes ;
    this.parent = document.querySelector(parentSelector);
    this.changeToUAH();
  } 
  changeToUAH (){
    this.price = this.price*this.transfer;
  }
  render (){
    const element = document.createElement('div')
    if(this.classes.length <=0){
      element.classList.add ('menu__item')
    } else { 
    this.classes.forEach (className => element.classList.add(className))}
    element.innerHTML = `
    
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Ціна:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          
    
    `;
    this.parent.append(element);
  }
}
const getResurses = async (url) =>{
  const res = await fetch(url);
  if (!res.ok){
    throw new Error(`could not fetch ${url}, status: ${res.status}`)
  }
  return await res.json();
};

// getResurses('')
//   .then(data =>{
//     data.forEach(({img, altimg, title, descr, price }) =>{
//       new MenuCard(img, altimg, title, descr, price, `.menu .container`).render();
//     })
//   })

axios.get('http://localhost:3000/menu')
  .then(data => {
    data.data.forEach(({img, altimg, title, descr, price }) =>{
      new MenuCard(img, altimg, title, descr, price, `.menu .container`).render();
    })
  })


//FORMS

const forms = document.querySelectorAll ('form');
const message = {
  loading: 'form/spinner.svg',
  success: 'Дякую, ми скоро звяжемось з вами',
  failure: 'Щось пішло не так'
};
forms.forEach( i =>{
  bindPostData(i)
});

const postData = async (url, data) =>{
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: data
  });
  return await res.json();
};

function bindPostData (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const statusMessage = document.createElement('img')
    statusMessage.src = message.loading;
    statusMessage.style.cssText= `
      display: block;
      margin: 0 auto;
    `;

    form.insertAdjacentElement('afterend', statusMessage);

     const formData = new FormData(form)

    const json = JSON.stringify(Object.fromEntries(formData.entries()))
  

    postData('http://localhost:3000/requests', json)
    .then(data => {
      console.log(data)
      showThanksModal(message.success);
      statusMessage.remove();
    }).catch(()=> {
      showThanksModal(message.failure)
    }).finally(() =>{
      form.reset();
    })
  })
}


function showThanksModal (message){
  const prevModalDialog = document.querySelector('.modal__dialog');

  prevModalDialog.classList.add('hide')
  openModal();
  
  const thanksModal = document.createElement('div');
    

    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
      <div class="modal__content">
         <div data-close class="modal__close">×</div>
         <div class="modal__title">${message}</div>
      <\div>
      
    `;
    modal.append(thanksModal)
    setTimeout(()=>{
      thanksModal.remove();
      prevModalDialog.classList.remove('hide');
      prevModalDialog.classList.add('show');
      closeModal();
    }, 4000)

}

fetch ('http://localhost:3000/menu').then(data => data.json()).then(res => console.log(res))

})