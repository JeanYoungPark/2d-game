export const scaleFactor = 4;

export const dialogueData = {
    pc: `This is my PC. I work mostly in JavaScript/TypeScript these days.
      I also like React and Php. Anyway regardless of the language, I just like programming.
      Here is my <a href="https://github.com/JeanYoungPark" target="_blank">Github</a>!`,
    "cs-degree": `This is my CS degree. I hung it on the wall because I'm proud of it. It was a very theoretical degree but I think it gave me a good foundation.`,
    "sofa-table": `I'm gonna explain about this game project in this comfort sofa. Check my <a href="https://velog.io/@jjing9/kaboom%EC%9D%B4%EB%9E%80" target="_blank">Velog</a>.`,
    tv: `That's my TV. I've been watching tech youtubers a lot recently like :
     <a href="https://www.youtube.com/@freecodecamp" target="_blank">freecodecamp</a>, <a href="https://www.youtube.com/@codingapple" target="_blank">코딩애플</a>,
    <a href="https://www.youtube.com/@nomadcoders" target="_blank">nomadcoders</a> and <a href="https://www.youtube.com/@devbadak" target="_blank">개발바닥</a>!`,
    bed: `This where I sleep. Great ideas comes when I'm lying on my bed. When an idea strikes, I often have to write it down or else I won't be able to sleep because my mental energy is consumed by it.`,
    resume: `This is my desk and on it is my resume. <a href="https://github.com/JSLegendDev/Resume/blob/main/JSLegend%20Resume-1.pdf" target="_blank">Check it out?</a>
    Contact me at jslegend@protonmail.com if you have any interesting job opportunities!`,
    projects: `Info about this portfolio : It's made with the Kaboom.js library which is a library for making games in JavaScript.
    Text is rendered with HTML/CSS. So the textbox you're currently reading is not rendered within canvas. Learn more about how to use
    Kaboom.js by watching some of my tutorials <a href="https://youtube.com/@jslegenddev" target="_blank">here</a>.`,
    library: `There are a lot of programming books on my shelves. There is even one in French (I also speak French btw).
    I probably only read one of them. Who else compulsively buys technical books without ever finishing them?`,
    npc: "Hi",
    fire: "Hey be careful",
};

export const anims = {
    "idle-down-player": 936,
    "idle-side-player": 975,
    "idle-up-player": 1014,
    "idle-attack-side-player": 1093,
    "idle-attack-down-player": 1092,
    "idle-attack-up-player": 1094,
    "walk-down-player": { from: 936, to: 939, loop: true, speed: 8 },
    "walk-side-player": { from: 975, to: 978, loop: true, speed: 8 },
    "walk-up-player": { from: 1014, to: 1017, loop: true, speed: 8 },

    "idle-attack-enemy": 14,
    "attack-side-enemy": { from: 1010, to: 1013, loop: true, speed: 8 },
    "attack-down-enemy": { from: 1127, to: 1130, loop: true, speed: 8 },
    "attack-up-enemy": { from: 1088, to: 1091, loop: true, speed: 8 },

    "idle-down-frog": 788,
    "idle-side-frog": 790,
    "idle-up-frog": 827,
    "walk-down-frog": { from: 788, to: 789, loop: true, speed: 4 },
    "walk-side-frog": { from: 790, to: 791, loop: true, speed: 4 },
    "walk-up-frog": { from: 827, to: 828, loop: true, speed: 4 },

    "idle-down-slime": 858,
    "idle-side-slime": 860,
    "idle-up-slime": 897,
    "walk-down-slime": { from: 858, to: 859, loop: true, speed: 4 },
    "walk-side-slime": { from: 860, to: 861, loop: true, speed: 4 },
    "walk-up-slime": { from: 897, to: 898, loop: true, speed: 4 },
};
