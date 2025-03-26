let messageID = "";
let fieldData;
let mutedUsersArray = [];
let minPadding = 5;
let thickness;
let shapeRoundness;
let widgetWidth;
let widgetHeight;
let paddingBorder;
let wigdetPadding = 20;
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
  console.log("Widget Loaded ", await SE_API.store.set("tester", "imagine some val"));
  console.log("API Finished", SE_API);
  GetData();
}
async function GetData() {
  console.log("Getting Data ", await SE_API.store.get("tester"));
  const test = await SE_API.counters.get("tester");
  SE_API.setField("fadeMessages", true, false);
}
window.addEventListener("onWidgetLoad", function(obj) {
  SetData();
  fieldData = { ...obj.detail.fieldData };
  thickness = (fieldData.borderThickness ?? 0) < minPadding ? minPadding : fieldData.borderThickness ?? 0;
  mutedUsersArray = fieldData.mutedUsers.toLowerCase().replace(" ", "").split(",");
  SetRoundness();
  InitializeGoal();
});
window.addEventListener("onSessionUpdate", function(obj) {
  obj.detail.session["tip-total"];
});
window.addEventListener("onEventReceived", function(obj) {
  if (obj.detail.listener === "event:test") {
    console.log(obj.detail.event.value === "hexeum_test_message");
  }
  const listener = obj.detail.listener;
  if (listener == "message") {
    console.log(obj.detail.event.data.displayColor);
    let data = obj.detail.event.data;
    BuildNewChatMessage(data);
  } else if (listener == "delete-message") {
    DeleteMessage(obj.detail.event.msgId);
  } else if (listener == "delete-messages") {
    DeleteAllUserMessages(obj.detail.event.userId);
  } else if (listener == "event:test" && obj.detail.event.value == "hexeum_test_message") {
    let randomMessage = PREVIEW_CHAT_MESSAGES[Math.floor(Math.random() * (PREVIEW_CHAT_MESSAGES.length - 1))];
    CreateTestMessage(randomMessage);
  }
});
function BuildNewChatMessage(data) {
  if (!(data.text.startsWith("!") && fieldData.hideCommands === true) && !mutedUsersArray.includes(data.nick)) {
    let color = data.displayColor !== "" ? data.displayColor : "#fff";
    let from = data.displayName;
    let message = buildMessage(data);
    ;
    let badges = BuildBadges(data.badges);
    if (fieldData.chatStyle == "bubbles") {
      addBubbleChatMessage(from, color, message, badges, data.userId, data.msgId);
    } else {
      addChatMessage(from, color, message, badges, data.userId, data.msgId);
    }
    $(".meta").removeAttr("style");
    $(".sideBar").each(function() {
      let parentHeight = $(this).parent().outerHeight();
      if (!parentHeight)
        return;
      $(this).outerHeight(parentHeight * 0.9);
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
  if (fieldData.borderRoundness == "straight" && fieldData.chatStyle == "bubbles") {
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + "em");
  } else if (fieldData.borderRoundness == "soft" && fieldData.chatStyle == "bubbles") {
    shapeRoundness = 1;
    $("body").css("--roundness", shapeRoundness + "em");
  } else if (fieldData.borderRoundness == "round" && fieldData.chatStyle == "bubbles") {
    shapeRoundness = 2;
    $("body").css("--roundness", shapeRoundness + "em");
  } else if (fieldData.borderRoundness == "straight" && fieldData.chatStyle == "box") {
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + "px");
  } else if (fieldData.borderRoundness == "soft" && fieldData.chatStyle == "box") {
    shapeRoundness = 25;
    $("body").css("--roundness", shapeRoundness + "px");
  } else if (fieldData.borderRoundness == "round" && fieldData.chatStyle == "box") {
    shapeRoundness = 50;
    $("body").css("--roundness", shapeRoundness + "px");
  }
}
function buildMessage(data) {
  let emotes = data.emotes;
  let words = data.text.split(" ");
  let emoteMatch = [];
  words.forEach((word) => {
    let match = emotes.find((emote) => emote.name == word);
    if (match !== void 0) {
      let emoteHTML = `<img alt="" src="${match.urls[1]}" class="emote"/>`;
      emoteMatch.push(emoteHTML);
    } else
      emoteMatch.push(word);
  });
  return emoteMatch.join(" ");
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
  $(newChatMsg).appendTo("#log");
  if (fieldData.messageAnimation == false) {
    $(`.chatMsgWrap[data-id="${messageID}"] .bubble.meta`)[0].style.transform = "scale(0)";
    $(`.chatMsgWrap[data-id="${messageID}"] .message.bubble`)[0].style.transform = "scale(0)";
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"] .bubble.meta`,
      scale: 1,
      duration: 800,
      easing: "easeOutElastic"
    });
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"] .message.bubble`,
      scale: 1,
      duration: 150,
      delay: 150,
      easing: "easeInOutQuad"
    });
  }
  if (fieldData.fadeMessages == true) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      opacity: "0",
      duration: 500,
      delay: fieldData.hideMessage * 1e3,
      easing: "linear"
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
  $(newChatMsg).appendTo("#log");
  if (fieldData.messageAnimation == false) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      marginLeft: "0%",
      duration: 300,
      easing: "easeInOutQuad"
    });
  }
  if (fieldData.fadeMessages == true) {
    anime({
      targets: `.chatMsgWrap[data-id="${messageID}"]`,
      opacity: "0",
      duration: 500,
      delay: fieldData.hideMessage * 1e3,
      easing: "linear"
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
let angleTL, angleBL, angleTR, angleBR, goalWidthBottom, topLeftPosition, goalWidthTop, bottomLeftPosition, bottomRightPosition, topRightPosition;
let mainPathPoints;
class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  AddVector2D(v2) {
    return new Vector2D(this.x + v2.x, this.y + v2.y);
  }
  AddVector(x, y) {
    return new Vector2D(this.x + x, this.y + y);
  }
  SubtractVector(x, y) {
    return new Vector2D(this.x - x, this.y - y);
  }
  RotateClockWise90Degrees() {
    return new Vector2D(this.y * -1, this.x);
  }
  RotateAntiClockWise90Degrees() {
    return new Vector2D(this.y, this.x * -1);
  }
  GetMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  Normalize() {
    return new Vector2D(this.x / this.GetMagnitude(), this.y / this.GetMagnitude());
  }
}
function SetViewBox() {
  widgetWidth = $("#hexeumWidget").width() ?? 0;
  widgetHeight = $("#hexeumWidget").outerHeight() ?? 0;
  paddingBorder = thickness > widgetHeight / 2 ? widgetHeight / 2 : thickness;
  $("#mainSVG").attr("viewBox", `0 0 ${widgetWidth} ${widgetHeight}`);
  $("#backdropSVG").attr("viewBox", `0 0 ${widgetWidth} ${widgetHeight}`);
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
  $("#log").width($("#mainSVG").width() ?? 0 - (wigdetPadding + thickness) * 2);
  $("#log").height($("#mainSVG").height() ?? 0 - (wigdetPadding + thickness) * 2);
}
function InitializeGoal() {
  SetViewBox();
  SetGoalAngles();
  SetLog();
  if (fieldData.chatStyle != "bubbles") {
    BuildWidget();
  }
  $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"
  );
  if (fieldData.previewMode == "true") {
    PreviewChat();
  }
}
function GetNextPoint(pathPoints, currentIndex) {
  if (currentIndex + 1 >= pathPoints.length) {
    return pathPoints[0];
  } else
    return pathPoints[currentIndex + 1];
}
function GetPreviousPoint(pathPoints, currentIndex) {
  if (currentIndex - 1 < 0) {
    return pathPoints[pathPoints.length - 1];
  } else
    return pathPoints[currentIndex - 1];
}
function CalculateSlope(p1, p2) {
  let yVal = p2.y - p1.y;
  let xVal = p2.x - p1.x;
  return yVal / xVal;
}
function BuildPath(pathPoints, innerPadding = 50) {
  let path;
  const direction = -1;
  for (let i = 0; i < 3; i++) {
    const currentPoint = pathPoints[i];
    const nextPoint = GetNextPoint(pathPoints, i);
    const previousPoint = GetPreviousPoint(pathPoints, i);
    const firstSlope = CalculateSlope(previousPoint, currentPoint);
    const secondSlope = CalculateSlope(currentPoint, nextPoint);
    if (firstSlope == secondSlope) {
      return null;
    }
    const firstDirection = firstSlope < 0 || Object.is(firstSlope, -0) ? -1 : 1;
    const secondDirection = secondSlope < 0 || Object.is(secondSlope, -0) ? -1 : 1;
    if ((firstSlope == 0 || secondSlope == 0) && (!isFinite(firstSlope) || !isFinite(secondSlope))) {
      const xPosition = currentPoint.x + innerPadding * firstDirection;
      const yPosition = currentPoint.y + innerPadding * secondDirection;
    }
  }
  return path;
}
function BuildWidget() {
  const pathMain = BuildPath(mainPathPoints);
  $("#goalMain").attr("d", pathMain);
  $("#goalMainBounds").attr("d", pathMain);
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
    text: randomMessage.message
  };
  const message = buildMessage(msgData);
  if (fieldData.chatStyle == "bubbles") {
    addBubbleChatMessage(from, color, message, badges, userId, msgId);
  } else {
    addChatMessage(from, color, message, badges, userId, msgId);
  }
}
function GenerateRandomHexId() {
  const randomHex = Math.floor(Math.random() * 65535).toString(16);
  return randomHex.padStart(8, "0");
}
