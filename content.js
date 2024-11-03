// ==UserScript==
// @name         KhanHack
// @namespace    https://greasyfork.org/users/783447
// @version      5.7.1
// @description  Khan Academy Answer Hack
// @author       Logzilla6 - IlyTobias - Illusions
// @match        https://*.khanacademy.org/*
// @icon         https://i.ibb.co/K5g1KMq/Untitled-drawing-3.png
// @downloadURL https://update.greasyfork.org/scripts/427964/KhanHack.user.js
// @updateURL https://update.greasyfork.org/scripts/427964/KhanHack.meta.js
// ==/UserScript==

//ALL FOLLOWING CODE IS UNDER THE KHANHACK TRADEMARK. UNAUTHORIZED DISTRIBUTION CAN/WILL RESULT IN LEGAL ACTION

//Note that KhanHack™ is an independent initiative and is not affiliated with or endorsed by Khan Academy. We respect the work of Khan Academy and its mission to provide free education, but KhanHack™ operates separately with its own unique goals.

let mainMenu = document.createElement('div');
mainMenu.id = 'mainMenu';
mainMenu.style.position = 'fixed';
mainMenu.style.bottom = '.5vw';
mainMenu.style.left = '19vw';
mainMenu.style.width = '300px';
mainMenu.style.height = '400px';
mainMenu.style.backgroundColor = '#123576';
mainMenu.style.border = '3px solid #07152e';
mainMenu.style.borderRadius = '20px';
mainMenu.style.padding = '10px';
mainMenu.style.color = "white";
mainMenu.style.fontFamily = "Noto sans";
mainMenu.style.fontWeight = "500";
mainMenu.style.transition = "all 0.3s ease";
mainMenu.style.zIndex = '1000';
mainMenu.style.display = 'flex';
mainMenu.style.flexDirection = 'column';

let copied = document.createElement('div');
copied.id = 'copyText';
copied.style.position = 'fixed';
copied.style.bottom = '17.5vw';
copied.style.left = '22.2vw';
copied.style.width = '150px';
copied.style.height = 'auto';
copied.style.backgroundColor = '#123576';
copied.style.border = '3px solid #07152e';
copied.style.borderRadius = '13px';
copied.style.color = "white";
copied.style.fontFamily = "Noto sans";
copied.style.fontWeight = "500";
copied.style.transition = "all 0.15s ease";
copied.style.padding = "5px";
copied.style.opacity = "0";

let answerBlocks = [];
let currentCombinedAnswer = '';
let isGhostModeEnabled = false;

const setCopiedContent = () => {
    copied.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; gap: 10px; opacity: 1; transition: opacity 0.5s ease;">
            <a>Successfully Copied!</a>
        </div>

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        </style>
    `;
}

const copyFlash = () => {
    copied.style.opacity = "1";
    setTimeout(() => {
        copied.style.opacity = "0";
    }, 1300);
};

const setMainMenuContent = () => {
    mainMenu.innerHTML =`
        <div id="menuContent" style="display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 1; transition: opacity 0.5s ease; height: 100%;">
            <head>
                <img id="discordIcon" src="https://i.ibb.co/grF973h/discord.png" alt="Discord" style="position: absolute; left: 15px; top: 15px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />
                <img id="headerImage" src="https://i.ibb.co/h2GFJ5f/khanhack.png" style="width: 130px; opacity: 1; transition: opacity 0.5s ease;" />
                <img id="gearIcon" src="https://i.ibb.co/q0QVKGG/gearicon.png" alt="Settings" style="position: absolute; right: 15px; top: 15px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />
            </head>
            <div id="answerList" style="width: 100%; display: flex; flex-direction: column; gap: 10px; flex-grow: 1; max-height: calc(100% - 100px); overflow-y: scroll; padding-bottom: 10px;"></div>
        </div>

        <img id="toggleButton" src="https://i.ibb.co/RpqPcR1/hamburger.png" class="toggleButton">
        <img id="clearButton" src="https://i.ibb.co/VYs1BPQ/can.png" style="width: 20px; height: 20px; bottom: 12px; right: 8px; position: absolute; cursor: pointer;">

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

            .toggleButton {
                position: absolute;
                bottom: 7px;
                left: 7px;
                height: 20px;
                width: 20px;
                cursor: pointer;
            }

            .block {
                width: 280px;
                min-height: 40px;
                height: auto;
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 10px;
                opacity: 1;
                display: flex;
                justify-content: center;
                transition: opacity 0.5s ease;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
                transition: 0.2s ease;
                word-wrap: break-word;
            }

            .block:hover {
                background-color: #d9d7d7;
            }

            .answer {
                margin: 0;
                text-align: center;
                color: black;
                font-family: "Noto Sans";
                font-weight: 500;
            }

            .imgBlock img {
                width: 250px;
                border-radius: 10px;
            }

            .copied {
                margin-top: -200px;
            }

            #answerList::-webkit-scrollbar {
                display: none;
            }

            #answerList {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        </style>
    `;

    addToggle();
    addSettings();
    addDiscord();
    addClear();



    const answerList = document.getElementById('answerList');
    answerList.innerHTML = '';

    answerBlocks.forEach(block => {
        if (block.type === 'text') {
            addAnswerBlock(block.content, false);
        } else if (block.type === 'image') {
            addImgAnswerBlock(block.content, false);
        }
    });

    if (isGhostModeEnabled) {
        enableGhostMode();
    }
};

const addImgAnswerBlock = (imgSrc, save = true) => {
    const answerList = document.getElementById('answerList');
    const block = document.createElement('div');
    block.className = 'block imgBlock';

    const img = document.createElement('img');
    img.src = imgSrc;

    block.appendChild(img);
    answerList.appendChild(block);

    if (save) {
        answerBlocks.push({ type: 'image', content: imgSrc });
    }
};

let isMenuVisible = true;
const addToggle = () => {
    document.getElementById('toggleButton').addEventListener('click', function() {
        const clearButton = document.getElementById('clearButton');
        if (isMenuVisible) {
            mainMenu.style.height = '15px';
            mainMenu.style.width = '15px';
            document.getElementById('menuContent').style.opacity = '0';
            clearButton.style.opacity = '0';
            setTimeout(() => {
                document.getElementById('menuContent').style.display = 'none';
                clearButton.style.display = 'none';
            }, 50);
        } else {
            mainMenu.style.height = '400px';
            mainMenu.style.width = '300px';
            document.getElementById('menuContent').style.display = 'flex';
            clearButton.style.display = 'block';
            setTimeout(() => {
                document.getElementById('menuContent').style.opacity = '1';
                clearButton.style.opacity = '1';
            }, 100);
        }
        isMenuVisible = !isMenuVisible;
    });
};

const addSettings = () => {
    document.getElementById('gearIcon').addEventListener('click', function() {
        mainMenu.innerHTML = `
            <div id="settingsContent" style="display: flex; flex-direction: column; align-items: center; position: relative; opacity: 1; transition: opacity 0.5s ease;">
                <img id="backArrow" src="https://i.ibb.co/Jt4qrD7/pngwing-com-1.png" alt="Back" style="position: absolute; left: 7px; top: 3px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />

                <h3 style="margin: 0; text-align: center; color: white; font-family: Noto sans; font-weight: 500;">Settings Menu</h3>
                <p style="text-align: center; color: white; font-family: Noto sans; margin-top: 15px;">
                    Ghost Mode: <input type="checkbox" id="ghostModeToggle" class="ghostToggle" ${isGhostModeEnabled ? 'checked' : ''}>
                </p>
                <p style="text-align: center; color: white; font-family: Noto sans; margin-top: 15px;">Auto Answer: BETA</p>
                <p style="text-align: center; color: white; font-family: Noto sans; margin-top: 15px;">Point Farmer: (Coming Soon)</p>
                <p style="text-align: center; color: white; font-family: Noto sans; margin-top: 30px; font-size: 25px;">Beta Access In Discord</p>
                <p style="text-align: center; color: white; font-family: Noto sans; margin-top: 80px;">KhanHack™ | 5.7</p>

                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

                    .ghostToggle {
                        width: 20px;
                        height: 20px;
                        background-color: white;
                        border-radius: 50%;
                        vertical-align: middle;
                        border: 2px solid #07152e;
                        appearance: none;
                        -webkit-appearance: none;
                        outline: none;
                        cursor: pointer;
                        transition: 0.2s ease;
                    }

                    .ghostToggle:checked {
                        background-color: #2967d9;
                    }
                </style>
            </div>
        `;
        document.getElementById('backArrow').addEventListener('click', setMainMenuContent);
        document.getElementById('ghostModeToggle').addEventListener('change', function() {
            isGhostModeEnabled = this.checked;
            if (isGhostModeEnabled) {
                enableGhostMode();
            } else {
                disableGhostMode();
            }
        });
    });
};

const enableGhostMode = () => {
    mainMenu.style.opacity = '0';
    mainMenu.addEventListener('mouseenter', handleMouseEnter);
    mainMenu.addEventListener('mouseleave', handleMouseLeave);
};

const disableGhostMode = () => {
    mainMenu.style.opacity = '1';
    mainMenu.removeEventListener('mouseenter', handleMouseEnter);
    mainMenu.removeEventListener('mouseleave', handleMouseLeave);
};

const handleMouseEnter = () => {
    mainMenu.style.opacity = '1';
};

const handleMouseLeave = () => {
    mainMenu.style.opacity = '0';
};

const addDiscord = () => {
    document.getElementById('discordIcon').addEventListener('click', function() {
        window.open('https://discord.gg/khanhack', '_blank');
    });
};

const addClear = () => {
    document.getElementById('clearButton').addEventListener('click', function() {
        location.reload();
    });
};

const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
    document.head.appendChild(script);

const katexStyle = document.createElement("link");
    katexStyle.rel = "stylesheet";
    katexStyle.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
    document.head.appendChild(katexStyle);

const addAnswerBlock = (answer, save = true) => {
    const answerList = document.getElementById('answerList');
    const block = document.createElement('div');

    block.className = 'block no-select';
    block.style.cursor = "pointer";
    block.addEventListener("click", () => {
        navigator.clipboard.writeText(answer);
        copyFlash();
    });

    const tc = document.createElement('p');
    tc.className = 'answer';

    const latexPattern = /\\frac|\\sqrt|\\times|\\cdot|\\degree|\\left|\\right|\^|\$|\{|\}/;
    if (latexPattern.test(answer)) {
        tc.innerHTML = '';
        katex.render(answer, tc)
    } else {
        tc.innerHTML = `${answer}`;
    }

    tc.style.fontFamily = '"Noto Sans", sans-serif';
    tc.style.fontWeight = "500";
    tc.style.fontStyle = "normal";
    tc.style.fontSize = "16px"

    block.appendChild(tc);
    answerList.appendChild(block);

    if (save) {
        answerBlocks.push({ type: 'text', content: answer });
    }
};

document.body.appendChild(mainMenu);
document.body.appendChild(copied);
setMainMenuContent();
setCopiedContent();

let originalJson = JSON.parse;
JSON.parse = function (jsonString) {
    let parsedData = originalJson(jsonString);

    try {
        if (parsedData.data && parsedData.data.assessmentItem && parsedData.data.assessmentItem.item) {

            let itemData = JSON.parse(parsedData.data.assessmentItem.item.itemData);
            let hasGradedWidget = Object.values(itemData.question.widgets).some(widget => widget.graded === true);
            if (hasGradedWidget) {


                for (let widgetKey in itemData.question.widgets) {



                    let widget = itemData.question.widgets[widgetKey];

                    switch (widget.type) {
                        case "numeric-input":
                            handleNumeric(widget);
                            break;
                        case "radio":
                            handleRadio(widget);
                            break;
                        case "expression":
                            handleExpression(widget);
                            break;
                        case "dropdown":
                            handleDropdown(widget);
                            break;
                        case "interactive-graph":
                            handleIntGraph(widget);
                            break;
                        case "grapher":
                            handleGrapher(widget);
                            break;
                        case "input-number":
                            handleInputNum(widget);
                            break;
                        case "matcher":
                            handleMatcher(widget);
                            break;
                        case "categorizer":
                            handleCateg(widget);
                            break;
                        case "label-image":
                            handleLabel(widget);
                            break;
                         case "matrix":
                            handleMatrix(widget);
                            break;
                        default:
                            console.log("Unknown widget: " + widget.type);
                            break;
                    }
                }

                if (currentCombinedAnswer.trim() !== '') {
                    addAnswerBlock(currentCombinedAnswer);
                    currentCombinedAnswer = '';
                }
            }
        }
    } catch (error) {
        console.log("Error parsing JSON:", error);
    }

    return parsedData;
};

function cleanLatexExpression(answer) {
    return answer
       //.replace(/\\times/g, '×')
       // .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1/$2)')
       // .replace(/\\cdot/g, '⋅')
       // .replace(/\\left|\\right/g, '')
       // .replace(/\^/g, '^')
       // .replace(/\\(?:[a-zA-Z]+)/g, '')
       // .replace(/(?<!\\){|}/g, '')
       // .replace(/\\sqrt/g, '')
          //.replace(/\degree/g, '')
          .replace(/\$/g, '');
}

function handleRadio(widget) {
    let corAns = widget.options.choices.filter(item => item.correct === true).map(item => item.content);
    let ansArr = [];
    let isNone = widget.options.choices.filter(item => item.isNoneOfTheAbove === true && item.correct === true)

    if (isNone.length > 0) {
        currentCombinedAnswer += "None of the above";
        return;
    }

    corAns.forEach(answer => {
        const hasGraphie = answer.includes('web+graphie')
        const hasNotGraphie = answer.includes('![]')

        if(hasGraphie || hasNotGraphie == true) {
            if(hasGraphie == true) {
                const split = answer.split('web+graphie');
                const midUrl = split[1].slice(0, -1);
                const finalUrl = 'https' + midUrl + '.svg';
                addImgAnswerBlock(finalUrl);
            } else if(hasNotGraphie == true) {
                const finalUrl = answer.slice(4, -1)
                addImgAnswerBlock(finalUrl);
            }
        } else {
            let cleaned = cleanLatexExpression(answer)
            ansArr.push(cleaned)
        }


    })

    if(ansArr.length) {
        currentCombinedAnswer += ansArr.join("|")
    }

}

function handleLabel(widget) {
    let corAns = widget.options.markers.filter(item => item.answers).map(item => item.answers)
    let labels = widget.options.markers.filter(item => item.label).map(item => item.label)
    let ansArr = []

    corAns.forEach((answer, index) => {
        if(labels == 0) {
            let cleaned = cleanLatexExpression(answer.toString());
            ansArr.push(cleaned)

        } else {
        let cleaned = cleanLatexExpression(answer.toString());
        let finLabel = labels[index].replace('Point ', '').replace(/[.]/g, '').trim() || "";
        let labeledAnswer = `${finLabel}: ${cleaned}`;
        ansArr.push(labeledAnswer)
        }

    })

    if(ansArr.length) {
        currentCombinedAnswer += ansArr.join("|")
    }


}

function handleNumeric(widget) {
    console.log(widget)
    const numericAnswer = widget.options.answers[0].value;
    currentCombinedAnswer += ` ${numericAnswer} `;
}

function handleExpression(widget) {
    let expressionAnswer = widget.options.answerForms[0].value;
    let cleaned = cleanLatexExpression(expressionAnswer)
    currentCombinedAnswer += ` ${cleaned} `;
}

function handleDropdown(widget) {
    let content = widget.options.choices.filter(item => item.correct === true).map(item => item.content);
    currentCombinedAnswer += ` ${content[0]} `;
}

function handleIntGraph(widget) {
    let coords = widget.options.correct.coords;
    let validCoords = coords.filter(coord => coord !== undefined);
    currentCombinedAnswer += ` ${validCoords.join(' | ')} `;
}

function handleInputNum(widget) {
    let inputNumAnswer = widget.options.value;
    currentCombinedAnswer += ` ${inputNumAnswer} `;
}

function handleMatcher(widget) {
    let matchAnswer = widget.options.right;
    currentCombinedAnswer += ` ${matchAnswer} `;
}

function handleGrapher(widget) {
    let coords = widget.options.correct.coords;
    currentCombinedAnswer += ` ${coords.join(' | ')} `;
}

function handleCateg(widget) {
    let values = widget.options.values;
    let categories = widget.options.categories;
    let labeledValues = values.map(value => categories[value]);

    currentCombinedAnswer += ` ${labeledValues} `
}

function handleMatrix(widget) {
    let arrs = widget.options.answers;
    currentCombinedAnswer += ` ${arrs.join(' | ')} `
}