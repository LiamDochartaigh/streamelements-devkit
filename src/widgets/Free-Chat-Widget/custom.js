let hideMessageTime;
let hideCommands;
let mutedUsers = [];
let disableMessageAnimations;
let fadeMessages;
let messageID = 0;
let chatStyle;

//Platform Specific
let goalTypeSelector, countTypeSelector;
let minPadding = 5;
let thickness = ({{borderThickness}} ?? 0) < minPadding ?minPadding: {{borderThickness}} ?? 0;
let paddingBorder;
let shapeRoundness;
let roundSetting;
let widgetWidth;
let wigdetPadding = 20;
let widgetGlow = {{glow}};
let borderStyle = "{{borderStyle}}";
let innerBorderPadding = 2;
let outerBorderPadding = 2;
let previewMode = false;

const PREVIEW_CHAT_MESSAGES = [
  {
    name: "steviebiscuits",
    message: "I always find the best music from this stream. CatBag"
  },
  {
    name: "gamer_girl",
    message: "I love playing games with you all! <3"
  },
  {
    name: "johndoe123",
    message: "Hey everyone, what's up? PogChamp"
  },
  {
    name: "kittykat",
    message: "This stream is so much fun! Kappa"
  },
  {
    name: "codingmaster",
    message: "I'm learning so much from this stream!"
  },
  {
    name: "streamfan",
    message: "I never miss a stream! Keep up the great work."
  },
  {
    name: "randomuser",
    message: "This chat is so friendly and welcoming! Keep it up! <3"
  },
  {
    name: "twitchfan",
    message: "I love this channel so much! Kreygasm"
  }
];

const PREVIEW_CHAT_EMOTES = [
  {
    "type": "ffz",
    "name": "CatBag",
    "id": "25927",
    "gif": false,
    "urls": {
      "1": "https://cdn.frankerfacez.com/emote/25927/1",
      "2": "https://cdn.frankerfacez.com/emote/25927/2",
      "4": "https://cdn.frankerfacez.com/emote/25927/4"
    },
    "start": 0,
    "end": 6
  },
  {
    "type": "twitch",
    "name": "LUL",
    "id": "425618",
    "gif": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/3.0"
    },
    "start": 13,
    "end": 15
  },
  {
    "type": "twitch",
    "name": "DansGame",
    "id": "33",
    "gif": false,
    "animated": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/3.0"
    },
    "start": 0,
    "end": 8
  },
  {
    "type": "twitch",
    "name": "<3",
    "id": "9",
    "gif": false,
    "animated": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/3.0"
    },
    "start": 9,
    "end": 11
  },
  {
    "type": "twitch",
    "name": "Kreygasm",
    "id": "41",
    "gif": false,
    "animated": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/3.0"
    },
    "start": 12,
    "end": 20
  },
  {
    "type": "twitch",
    "name": "Kappa",
    "id": "25",
    "gif": false,
    "animated": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/3.0"
    },
    "start": 21,
    "end": 26
  },
  {
    "type": "twitch",
    "name": "PogChamp",
    "id": "305954156",
    "gif": false,
    "animated": false,
    "urls": {
      "1": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/1.0",
      "2": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/2.0",
      "4": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/3.0"
    },
    "start": 27,
    "end": 35
  }
];

async function SetData() {
  console.log("Widget Loaded ", await SE_API.store.set('tester', 'imagine some val'));
  console.log('API Finished', SE_API);
  GetData();
}

async function GetData(){
  console.log("Getting Data ", await SE_API.store.get('tester'));
}

window.addEventListener('onWidgetLoad', function (obj) {
  SetData();
  let fieldData = obj.detail.fieldData;
  hideMessageTime = fieldData.hideMessage;
  hideCommands = fieldData.hideCommands;
  mutedUsers = fieldData.mutedUsers.toLowerCase().replace(" ", "").split(",");
  disableMessageAnimations = fieldData.messageAnimation;
  fadeMessages = fieldData.fadeMessages;
  chatStyle = fieldData.chatStyle;
  roundSetting = fieldData.borderRoundness;
  previewMode = fieldData.previewMode;
  SetRoundness();
  InitializeGoal();
});

window.addEventListener("onSessionUpdate", function (obj) {
});

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  if (listener == "message") {
    let data = obj.detail.event.data;
    BuildNewChatMessage(data);
  } else if (listener == "delete-message") {
    DeleteMessage(obj.detail.event.msgId);
  }
  else if (listener == 'delete-messages') {
    DeleteAllUserMessages(obj.detail.event.userId);
  }
  else if (listener == 'event:test' && obj.detail.event.value == "hexeum_test_message") {
    const filteredMessages = PREVIEW_CHAT_MESSAGES.filter(message => !message.type);
    let randomMessage = filteredMessages[Math.floor(Math.random() * (filteredMessages.length - 1))];
    CreateTestMessage(randomMessage);
  }
});

function BuildNewChatMessage(data) {
  if (!(data.text.startsWith("!") && hideCommands === true) &&
    !mutedUsers.includes(data.nick)) {
    let color = data.displayColor !== "" ? data.displayColor : "#fff";
    let from = data.displayName;
    let message = buildMessage(data);;
    let badges = BuildBadges(data.badges);
    if (chatStyle == 'bubbles') { addBubbleChatMessage(from, color, message, badges, data.userId, data.msgId); }
    else { addChatMessage(from, color, message, badges, data.userId, data.msgId); }

    $(".meta").removeAttr("style");

    $(".sideBar").each(function () {
      var parentHeight = $(this).parent().outerHeight();
      $(this).outerHeight(parentHeight * .9);
    });
  }
}

function BuildBadges(badges) {
  let formattedBadges = "";
  for (let i = 0; i < badges.length; i++) {
    formattedBadges += `<img alt="" src="${badges[i].url}" class="badge"> `;
  }
  return formattedBadges;
}

function SetRoundness() {
  if (roundSetting == "straight" && chatStyle == 'bubbles') {
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if (roundSetting == "soft" && chatStyle == 'bubbles') {
    shapeRoundness = 1;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if (roundSetting == "round" && chatStyle == 'bubbles') {
    shapeRoundness = 2;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if (roundSetting == "straight" && chatStyle == 'box') {
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + 'px');
  }
  else if (roundSetting == "soft" && chatStyle == 'box') {
    shapeRoundness = 25;
    $("body").css("--roundness", shapeRoundness + 'px');
  }
  else if (roundSetting == "round" && chatStyle == 'box') {
    shapeRoundness = 50;
    $("body").css("--roundness", shapeRoundness + 'px');
  }
}

function buildMessage(data) {
  let emotes = data.emotes;
  let words = data.text.split(" ");
  let emoteMatch = [];
  words.forEach(word => {
    let match = emotes.find(emote => emote.name == word);
    if (match !== undefined) {
      let emoteHTML = `<img alt="" src="${match.urls[1]}" class="emote"/>`
      emoteMatch.push(emoteHTML);
    } else emoteMatch.push(word);
  });
  return emoteMatch.join(' ');
}

function addBubbleChatMessage(from, color, message, badges, userId, msgId) {
  messageID = msgId;
  const newChatMsg = $.parseHTML(`<div class="chatMsgWrap" data-from="${userId}" data-id="${messageID}">
        <span class="bubble meta" style="color: ${color};">
          <span class="badges">${badges}</span>
          <span class="name">${from}</span>
        </span>
	    <div> 
        <div class="message bubble">
         <div>${message}</div>
		</div>
	</div>  
</div>`);
  $(newChatMsg).appendTo('#log');

  if (disableMessageAnimations == false) {
    $(`.chatMsgWrap[data-id="${messageID}"] .bubble.meta`)[0].style.transform = 'scale(0)';
    $(`.chatMsgWrap[data-id="${messageID}"] .message.bubble`)[0].style.transform = 'scale(0)';
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"] .bubble.meta`,
      scale: 1,
      duration: 800,
      easing: "easeOutElastic",
    });

    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"] .message.bubble`,
      scale: 1,
      duration: 150,
      delay: 150,
      easing: "easeInOutQuad",
    });
  }

  if (fadeMessages == true) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      opacity: '0',
      duration: 500,
      delay: (hideMessageTime * 1000),
      easing: "linear",
    });
  }

}

function addChatMessage(from, color, message, badges, userId, msgId) {
  messageID = msgId;
  const newChatMsg = $.parseHTML(`<div class="chatMsgWrap" style="margin-left: 100%" data-from="${userId}" data-id="${messageID}">
     <div class="containerAfter">
      <div class="textWrapper">
        <span class="meta" style="color: ${color}">
          <span class="badges">${badges}</span>
          <span class="name">${from}</span>
        </span>
        <div class="message">
          ${message}
        </div>
      </div>
	</div>  
  <div class="seperator"></div>
</div>`);
  $(newChatMsg).appendTo('#log');

  if (disableMessageAnimations == false) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      marginLeft: '0%',
      duration: 300,
      easing: "easeInOutQuad",
    });
  }

  if (fadeMessages == true) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      opacity: '0',
      duration: 500,
      delay: (hideMessageTime * 1000),
      easing: "linear",
    });
  }
}

function DeleteMessage(msgId) {
  $(`.chatMsgWrap[data-id="${msgId}"] .message`).text("Message Deleted");
  $(`.chatMsgWrap[data-id="${msgId}"] .message`).css("font-style", "italic");
}

function DeleteAllUserMessages(userId) {
  $(`.chatMsgWrap[data-from="${userId}"] .message`).text("Message Deleted");
  $(`.chatMsgWrap[data-from="${userId}"] .message`).css("font-style", "italic");
}

let angleTL, angleBL, angleTR, angleBR, goalWidthBottom, goalWidthTop, topLeftPosition,
  bottomLeftPosition, bottomRightPosition, topRightPosition, mainPathPoints;

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  AddVector2D(v2) {
    return new Vector2D((this.x + v2.x), (this.y + v2.y));
  }
  AddVector(x, y) {
    return new Vector2D((this.x + x), (this.y + y));
  }
  SubtractVector(x, y) {
    return new Vector2D((this.x - x), (this.y - y));
  }
  RotateClockWise90Degrees() {
    return new Vector2D(this.y * (-1), this.x);
  }
  RotateAntiClockWise90Degrees() {
    return new Vector2D(this.y, this.x * (-1));
  }
  GetMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  Normalize() {
    return new Vector2D(this.x / this.GetMagnitude(), this.y / this.GetMagnitude());
  }
}

function GetVectorDirection(v1, v2) {
  let direction = new Vector2D(v2.x - v1.x, (v2.y - v1.y));
  let magnitude = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
  let directonNormalized = new Vector2D(direction.x / magnitude, direction.y / magnitude);
  return directonNormalized;
}

//next, current, previous
function CalculateAngleBetweenPoints(p1, p2, p3) {
  let a = new Vector2D((p1.x - p2.x), (p1.y - p2.y));
  let b = new Vector2D((p3.x - p2.x), (p3.y - p2.y));
  let abProduct = (a.x * b.x + a.y * b.y);
  let magnitudeA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
  let magnitudeB = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
  let radians = Math.acos(abProduct / (magnitudeA * magnitudeB));
  return RadiansToDegrees(radians);
}

function RadiansToDegrees(radians) {
  let pi = Math.PI;
  return radians * (180 / pi);
}

function DegreesToRadians(degrees) {
  let pi = Math.PI;
  return degrees * (pi / 180);
}

function SetSelectors(period, goalType) {
  goalTypeSelector = goalType + "-" + period;
  if (
    goalType == "cheer" ||
    goalType == "tip" ||
    goalType == "superchat" ||
    goalType == "stars"
  ) {
    countTypeSelector = "amount";
  } else {
    countTypeSelector = "count";
  }
}

function SetViewBox() {
  widgetWidth = $("#hexeumWidget").width();
  widgetHeight = $('#hexeumWidget').outerHeight();
  paddingBorder = thickness > (widgetHeight / 2) ? widgetHeight / 2 : thickness;
  $('#mainSVG').attr('viewBox', `0 0 ${widgetWidth} ${widgetHeight}`);
  $('#backdropSVG').attr('viewBox', `0 0 ${widgetWidth} ${widgetHeight}`)
}

function SetGoalAngles() {
  angleTL = 0;
  angleBL = 0;
  angleTR = 0;
  angleBR = 0;

  goalWidthBottom = widgetWidth - angleBL - angleBR;
  goalWidthTop = widgetWidth - angleTL - angleTR;
  topLeftPosition = new Vector2D(angleTL, 0);
  bottomLeftPosition = new Vector2D(topLeftPosition.x + angleBL - angleTL, topLeftPosition.y + widgetHeight);
  bottomRightPosition = new Vector2D(bottomLeftPosition.x + goalWidthBottom, bottomLeftPosition.y);
  topRightPosition = new Vector2D(bottomRightPosition.x + angleBR - angleTR, bottomRightPosition.y - widgetHeight);
  mainPathPoints = [topLeftPosition, bottomLeftPosition, bottomRightPosition, topRightPosition];
}

function SetLog() {
  $('#log').width($('#mainSVG').width() - ((wigdetPadding + thickness) * 2));
  $('#log').height($('#mainSVG').height() - ((wigdetPadding + thickness) * 2));
}

function InitializeGoal() {
  SetViewBox();
  SetGoalAngles();
  SetLog();
  if (chatStyle != 'bubbles') {
    BuildWidget();
  }
  $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js");
  if (previewMode == "true") {
    PreviewChat();
  }
}

function GetNextPoint(pathPoints, currentIndex) {
  if (currentIndex + 1 >= pathPoints.length) {
    return pathPoints[0];
  }
  else return pathPoints[currentIndex + 1];
}

function GetPreviousPoint(pathPoints, currentIndex) {
  if (currentIndex - 1 < 0) { return pathPoints[pathPoints.length - 1]; }
  else return pathPoints[currentIndex - 1];
}

function CalculateSlope(p1, p2) {
  let yVal = (p2.y - p1.y);
  let xVal = (p2.x - p1.x);
  return yVal / xVal;
}

function GetYIntercept(point, slope) {
  if (isFinite(slope)) {
    return point.y - slope * point.x;
  } else {
    return point.y - point.x;
  }
}

function CreateParallelLine(slope, originalYIntercept, distance) {

  direction = -1;
  console.log("Slope: ", slope, "Direction: ", direction, 'Original Y Intercept: ', originalYIntercept);

  //Happens for horizontal lines
  if (isFinite(slope)) {
    return originalYIntercept + direction * distance * Math.sqrt(1 + Math.pow(slope, 2));
  } else {
    return originalYIntercept + direction * distance;
  }
}

function calculateIntersection(slope1, yIntercept1, slope2, yIntercept2) {
  // Case 1: Both lines are vertical (infinite slopes)
  if (!isFinite(slope1) && !isFinite(slope2)) {
    return null; // Parallel vertical lines, no intersection
  }

  // Case 2: First line is vertical (slope1 is infinite)
  if (!isFinite(slope1)) {
    const xIntersection = yIntercept1; // x value is constant for vertical line
    const yIntersection = slope2 * xIntersection + yIntercept2; // y from second line
    return { x: xIntersection, y: yIntersection };
  }

  // Case 3: Second line is vertical (slope2 is infinite)
  if (!isFinite(slope2)) {
    const xIntersection = yIntercept2; // x value is constant for vertical line
    const yIntersection = slope1 * xIntersection + yIntercept1; // y from first line
    return { x: xIntersection, y: yIntersection };
  }

  // Case 4: First line is horizontal (slope1 = 0)
  if (slope1 === 0) {
    const yIntersection = yIntercept1; // y value is constant for horizontal line
    const xIntersection = (yIntersection - yIntercept2) / slope2; // Solve for x in the second line's equation
    return { x: xIntersection, y: yIntersection };
  }

  // Case 5: Second line is horizontal (slope2 = 0)
  if (slope2 === 0) {
    const yIntersection = yIntercept2; // y value is constant for horizontal line
    const xIntersection = (yIntersection - yIntercept1) / slope1; // Solve for x in the first line's equation
    return { x: xIntersection, y: yIntersection };
  }

  // Case 6: General case (non-parallel, non-vertical, non-horizontal lines)
  if (slope1 === slope2) {
    return null; // Parallel lines, no intersection
  }

  const xIntersection = (yIntercept2 - yIntercept1) / (slope1 - slope2);
  const yIntersection = slope1 * xIntersection + yIntercept1;

  return { x: xIntersection, y: yIntersection };
}

//Accepts a path of Vector2D's
function BuildPath(pathPoints, innerPadding = 50) {
  let path;

  //Programmatically determine the direction of the set of vectors in series
  const direction = -1;

  for (let i = 0; i < 3; i++) {
    const currentPoint = pathPoints[i];
    const nextPoint = GetNextPoint(pathPoints, i);
    const previousPoint = GetPreviousPoint(pathPoints, i);

    const firstSlope = CalculateSlope(previousPoint, currentPoint);
    const secondSlope = CalculateSlope(currentPoint, nextPoint);

    //If the slopes are the same, the lines are parallel
    if (firstSlope == secondSlope) {
      return null;
    }

    const firstDirection = (firstSlope < 0 || firstSlope == -0) ? -1 : 1;
    const secondDirection = (secondSlope < 0 || secondSlope == -0) ? -1 : 1;
    console.log("First Slope: ", firstSlope, "Second Slope: ", secondSlope);
    console.log("First Dir: ", firstDirection, "Second Dir: ", secondDirection);

    //In this case we only can have a horizontal, vertical or normal line
    if ((firstSlope == 0 || secondSlope == 0)
      && (!isFinite(firstSlope) || !isFinite(secondSlope))) {
      const xPosition = currentPoint.x + (innerPadding * firstDirection);
      const yPosition = currentPoint.y + (innerPadding * secondDirection);
      console.log("Intersection then can only be ", xPosition, yPosition);
    }


    //const firstIntercept = GetYIntercept(currentPoint, firstSlope);
    //const firstParralelIntercept = CreateParallelLine(firstSlope, firstIntercept, innerPadding);
    // console.log("First Deets ", firstSlope, firstIntercept, firstParralelIntercept);

    //const secondIntercept = GetYIntercept(nextPoint, secondSlope);
    //const secondParralelIntercept = CreateParallelLine(secondSlope, secondIntercept, innerPadding);

    // console.log("Second Deets ", secondSlope, secondIntercept, secondParralelIntercept);

    //const intersection = CalculateIntersection(firstSlope, firstParralelIntercept, secondSlope, secondParralelIntercept);

    //console.log('Intersection: ', intersection);

    // if (!path) {
    //   path = `M${intersection.x} ${intersection.y}`;
    // }
    // else{
    //   path += `L ${intersection.x} ${intersection.y}`;
    // }
  }
  return path;
}

function GetOuterBorderPadding() {
  let padding = borderStyle == "detailed" ? outerBorderPadding : 0;
  if (padding < 0) { return 0 }
  else if (padding > thickness) { return thickness }
  else return padding;
}

function GetInnerBorderPadding() {
  let innerPadding = borderStyle == "detailed" ? innerBorderPadding : 0;
  let padding = thickness - innerPadding;
  if (padding < 0) { return 0 }
  else if (padding > thickness) { return thickness }
  else return padding;
}

function GetMainThickness() {
  let mainThickness = thickness - GetOuterBorderPadding();
  if (mainThickness < 0) { return 0 }
  else if (mainThickness > thickness) { return thickness }
  else return mainThickness;
}

function GetInsetThickness() {
  let insetThickness = borderStyle == "detailed" ? innerBorderPadding : 0;
  if (insetThickness < 0) { return 0 }
  else if (insetThickness > thickness) { return thickness }
  else return insetThickness;
}

function BuildWidget() {

  const pathMain = BuildPath(mainPathPoints);
  //const pathMainMask = BuildPath(mainPathPoints, thickness);

  $('#goalMain').attr("d", pathMain);
  $('#goalMainBounds').attr("d", pathMain);
  //$('#goalMainCutOff').attr("d", pathMainMask);
}

function UpdateMasking(percentageComplete) {
  let percentageMultiplier = percentageComplete / 100;

  let positionDifference = bottomLeftPosition.x - topLeftPosition.x;
  let startingPosition = bottomLeftPosition.x - positionDifference;

  let endPositionDifference = topRightPosition.x - bottomRightPosition.x;
  let endingPosition = (topRightPosition.x - endPositionDifference) * percentageMultiplier;

  let firstPosition = new Vector2D(startingPosition, topLeftPosition.y);
  let secondPosition = new Vector2D(bottomLeftPosition.x, bottomLeftPosition.y);
  let thirdPosition = new Vector2D(endingPosition, bottomRightPosition.y);
  let fourthPosition = new Vector2D(endingPosition, topRightPosition.y);

  let updatedPath = [firstPosition, secondPosition, thirdPosition, fourthPosition];
}

function PreviewChat() {
  let i = 0;
  const interval = setInterval(() => {

    let randomMessage = PREVIEW_CHAT_MESSAGES[i];
    CreateTestMessage(randomMessage);
    i++;
    if (i >= 8) {
      clearInterval(interval);
    }
  }, 250);
}

function CreateTestMessage(randomMessage) {
  const msgId = GenerateRandomHexId();
  const color = "#fff";
  const from = randomMessage.name;
  const userId = randomMessage.name;
  const badges = BuildBadges([{ url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3" }]);
  const msgData = {
    emotes: PREVIEW_CHAT_EMOTES,
    text: randomMessage.message,
  }
  const message = buildMessage(msgData);
  if (chatStyle == 'bubbles') { addBubbleChatMessage(from, color, message, badges, userId, msgId); }
  else { addChatMessage(from, color, message, badges, userId, msgId); }
}

function GenerateRandomHexId() {
  const randomHex = Math.floor(Math.random() * 65535).toString(16);
  return randomHex.padStart(8, '0');
}