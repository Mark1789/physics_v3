//let coords = blk.getBoundingClientRect();
// elements
let area = document.querySelector(".area");
let hero = document.querySelector(".hero");
let enemy = document.querySelector(".enemy");
let coin = document.querySelector(".coin");
let panes = document.querySelectorAll(".pane");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let jump = document.querySelector(".jump");
let shoot = document.querySelector(".shoot");
let arm = document.querySelector(".arm");
let hit = document.querySelector(".hit");
let score = document.querySelector(".score");
let gate = document.querySelector(".gate");
let gate_close = document.querySelector(".gate_close");
let win = document.querySelector(".win");



let area_coords = area.getBoundingClientRect();



// переменная для setInterval control
let move_left; 
// начальная точка отсчета для control
let hero_style_left = 0;
// начальная точка отсчета для hero scroll
let hero_style_leftScroll = 0;
// это top, падение
let hero_tumble = 0;
// пока true hero падает
let hero_tumble_check = true;
// высоты прыжка
let hero_jump_max = 90;
// step
let step = 1;
// speed process
let speed = 0;
// высота поыжка
let jump_height = 0;
// shoot delay
let shoot_delay = 0;
// shoot directory
let shoot_direct = true;
// активатор control
let hero_left = false;
let hero_right = false;
let hero_jump = false;
let hero_shoot = false;
let hero_right_scroll = false;
let hero_left_scroll = false;
let gate_status = false;

// objects of coords panes, getBounding...
let coords_panes = [];
// для проверки столкновения с платформой 
let pane_check = 0;

for (let el of panes) {
  let pane = el.getBoundingClientRect();
  coords_panes.push(pane);
}

let hero_obj = {
  left: function () {
    hero.style.left = hero_style_left + 'px';
    hero_style_left -= step;
  },
  right: function () {
    hero.style.left = hero_style_left + 'px';
    hero_style_left += step;
  },
  leftScroll: function () {
    area.scrollLeft -= 
    hero_style_leftScroll + step;
  },
  rightScroll: function () {
    area.scrollLeft += 
    hero_style_leftScroll + step;
  },
  tumble: function () {
    hero.style.top = hero_tumble + 'px';
    hero_tumble += step;
  },
  jump: function () {
    hero.style.top = hero_tumble + 'px';
    hero_tumble -= step;
  },
  hit: function () {
    arm.style.display = 'block';
    setTimeout(() => {
      arm.style.display = 'none';
    }, 200)
    let arm_coords = arm.getBoundingClientRect();
    let enemy_c = enemy.getBoundingClientRect();
    
    if ((arm_coords.top <= enemy_c.bottom && arm_coords.bottom >= enemy_c.top) && (arm_coords.left <= enemy_c.right && arm_coords.right >= enemy_c.left)) {
       score.innerHTML = +score.innerHTML + 5;
     vrag.create();
    }
  }
}

let coin_obj = {
  create: function () {
    let randomPane = coords_panes[Math.floor(Math.random() * panes.length)]
    coin.style.top = randomPane.top - 29 + 'px';
    coin.style.left = randomPane.left + Math.floor(Math.random()*randomPane.width) - (coin.offsetWidth/2) - area_coords.left + 'px';
  }
}

class Obj_enemy {
  constructor () {
  // начальная точка отсчета от платfормы
  this["enemy_style_left"] = 0;
  this["enemy_pane"] = null;
  // personal step
  this["enemy_step"] = step;
  }
  
  create () {
    let randomPane = coords_panes[Math.floor(Math.random() * panes.length)];
    this["enemy_pane"] = randomPane;
    enemy.style.top = randomPane.top - enemy.offsetHeight - area_coords.top - 1 + 'px';
    let random_left = randomPane.left + Math.floor(Math.random()*(randomPane.width - enemy.offsetWidth)) - area_coords.left;
    enemy.style.left = random_left + 'px';
    this["enemy_style_left"] = random_left;
  }
  
  move (x) {
    // x - enemy_coords
    enemy.style.left = this["enemy_style_left"] + 'px';
    
      this["enemy_style_left"] += this["enemy_step"]/5;
      if (x.right > this["enemy_pane"].right - area.scrollLeft) this["enemy_step"] = (-1)*step;
      if (x.left < this["enemy_pane"].left - area.scrollLeft) this["enemy_step"] = step;
  }
}

let shoot_obj = {
  create: function (directory, enemy_c) {
    let top = parseInt(hero.style.top);
    let left = parseInt(hero.style.left);
    let shot_style_left = 0;
    let shot = document.createElement('div');
    shot.style.cssText = 'position: absolute; width: 6px; height: 3px; background: orange; z-index: 1;';
    area.insertAdjacentElement('afterbegin', shot);
    shot.style.top = top + (hero.offsetHeight/2.3)+ 'px';
    shot.style.left = left + 'px';
    shot_style_left = parseInt(shot.style.left) || 1;
    
    // fly shot
    let shot_fly = setInterval(() => {
      
    let shot_coords = shot.getBoundingClientRect();

      
    shot.style.left = shot_style_left + 'px';
    
    // задаем директорию полета пули
   if (directory) {
    shot_style_left += (Math.random() * 10);
    }
     if (!directory) {
    shot_style_left -= (Math.random() * 10);
    }
    
    // определяем границы полета
   if (shot_style_left > area.clientWidth + area.scrollLeft || shot_style_left < area.scrollLeft) {
     clearInterval(shot_fly)
     shot.remove()
   }
   
   // проверка соприкосновения пули с врагом
   if ((shot_coords.top <= enemy_c.bottom && shot_coords.bottom > enemy_c.top) && (shot_coords.left <= enemy_c.right && shot_coords.right >= enemy_c.left)) {
     clearInterval(shot_fly);
     shot.remove();
     score.innerHTML = +score.innerHTML + 2;
     vrag.create();
   }
    }, 1)
  }
}

let vrag = new Obj_enemy();
vrag.create();
coin_obj.create();

let process = setInterval(() => {
 
  let hero_coords = hero.getBoundingClientRect();
  let coin_coords = coin.getBoundingClientRect();
  let enemy_coords = enemy.getBoundingClientRect();
  let gate_coords = gate.getBoundingClientRect();


// border area left
  if (hero_coords.left === area.offsetLeft + 1) {
    hero_left = false;
  }
  // border area right
  if (hero_coords.right === area.offsetLeft + area.clientWidth) {
    hero_right = false;
  }
  
  // проверка на падение
  if (hero_tumble_check) {
    hero_obj.tumble()
  }
  
  // проверка на падение в пропасть
  if (hero_coords.top > area.offsetTop + area.clientHeight) {
    alert('fail');
    clearInterval(process);
    location.reload();
  }
  
  // проверка состояния ворот
     gate_close.style.display = 'none';
  if (score.innerHTML >= 100) {
    gate.style.background = 'white';
    gate_status = true;
  } else if ((hero_coords.top <= gate_coords.bottom && hero_coords.bottom >= gate_coords.top) && (hero_coords.left <= gate_coords.right && hero_coords.right >= gate_coords.left)) {
    gate_close.style.display = 'block';
  }
  
  // win
  if (gate_status && (hero_coords.top <= gate_coords.bottom && hero_coords.bottom >= gate_coords.top) && (hero_coords.left <= gate_coords.right && hero_coords.right >= gate_coords.left)) {
    clearInterval(process);
    win.style.display = 'block';
    setTimeout(() =>  {
      location.reload();
    }, 5000)
  }
  
  // move hero
  // move to scroll right
   if (area.scrollLeft + area.clientWidth < area.scrollWidth && hero.offsetLeft > area.clientWidth/2) {
     hero_right_scroll = true;
  } else {
    hero_right_scroll = false;
  }
  if (hero_right_scroll && hero_right) {
    hero_obj.rightScroll();
    hero_obj.right();
    hero.style.transform = 'scale(1,1)';
    shoot_direct = true;
  } else if (hero_right) {
    hero_obj.right();
    hero.style.transform = 'scale(1,1)';
    shoot_direct = true;
  } 
  // hero move scroll left
   if (area.scrollLeft > 0 && hero.offsetLeft < area.clientWidth/2 + area.scrollLeft) {
     hero_left_scroll = true;
  } else {
    hero_left_scroll = false;
  }
  if (hero_left_scroll && hero_left) {
    hero_obj.leftScroll();
    hero_obj.left();
    hero.style.transform = 'scale(-1,1)';
    shoot_direct = false;
  } else if (hero_left) {
    hero_obj.left();
    hero.style.transform = 'scale(-1,1)';
    shoot_direct = false;
  }
  
  // shoot hero
  if (hero_shoot && (shoot_delay > 50)) {
    shoot_obj.create( shoot_direct, enemy_coords)
    shoot_delay = 0;
  }
  // move enemy;
  vrag.move(enemy_coords);
  
  if (shoot_delay < 51) {
  shoot_delay += 1;
  }
  
  // проверка на столкновение с платформой и костыль top, чтобы координаты hero считывались относительно area, а не window
  let top = parseInt(hero.style.top)
  for (let i = 0; i < panes.length; i += 1) {
    if ((hero_coords.left < (coords_panes[i].right - area.scrollLeft) && hero_coords.right > (coords_panes[i].left - area.scrollLeft)) && (top+hero.clientHeight) === coords_panes[i].top - 9) {
      hero.style.top = coords_panes[i].top - 29 + 'px';
      hero_tumble_check = false;
      pane_check += 1;
    } else if (pane_check === 0) {
      hero_tumble_check = true;
    }
  }
  pane_check = 0;
  
  // catch coin
  if ((hero_coords.top <= coin_coords.bottom && hero_coords.bottom >= coin_coords.top) && (hero_coords.left <= coin_coords.right && hero_coords.right >= coin_coords.left)) {
    score.innerHTML = +score.innerHTML + 1;
    coin_obj.create();
  }
  
  // crash with enemy
  if ((hero_coords.bottom === enemy_coords.top) && (hero_coords.left <= enemy_coords.right && hero_coords.right >= enemy_coords.left)) {
    score.innerHTML = +score.innerHTML + 10;
    // ±++++++++++++++++
    vrag.create();
  } else if ((hero_coords.top <= enemy_coords.bottom && hero_coords.bottom > enemy_coords.top) && (hero_coords.left <= enemy_coords.right && hero_coords.right >= enemy_coords.left)) {
    alert('fail');
    clearInterval(process);
    location.reload();
  }
  
  // при прыжке
  if (hero_jump) {
    hero_obj.jump();
    jump_height += 1;
   hero_tumble_check = false;
    // высота прыжка
    if (jump_height === hero_jump_max) {
    hero_jump = false; 
    jump_height = 0;
    }
  }
}, speed)

// block touch area
area.addEventListener('touchstart', (event) => {
 event.preventDefault();
})

// move left
left.addEventListener('touchstart', (event) =>  {
    event.preventDefault();
  hero_left = true;
})
left.addEventListener('touchend', () => {
  event.preventDefault();
  hero_left = false;
})

// move right
right.addEventListener('touchstart', (event) =>  {
     event.preventDefault();
  hero_right = true;
})
right.addEventListener('touchend', () => {
  event.preventDefault();
  hero_right = false;
})

// jump
jump.addEventListener('touchstart', (event) =>  {
       event.preventDefault();
  if (!hero_jump && !hero_tumble_check) {
   hero_jump = true; 
  }
})

// fire
shoot.addEventListener('touchstart', (event) =>  {
  event.preventDefault();
  hero_shoot = true;
})
shoot.addEventListener('touchend', () => {
  event.preventDefault();
  hero_shoot = false;
})

// hit
hit.addEventListener('touchstart', (event) =>  {
  event.preventDefault();
  hero_obj.hit();
})
