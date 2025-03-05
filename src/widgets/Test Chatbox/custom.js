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
let thickness = ({{borderThickness}} ?? 0) < minPadding ? minPadding : {{borderThickness}} ?? 0;
let paddingBorder;
let shapeRoundness;
let roundSetting;
let widgetWidth;
let wigdetPadding = 20;
let widgetGlow = {{glow}};
let borderStyle = "{{borderStyle}}";
let innerBorderPadding = 2;
let outerBorderPadding = 2;


window.addEventListener('onWidgetLoad', function(obj) {
    let fieldData = obj.detail.fieldData;
    hideMessageTime = fieldData.hideMessage;
    hideCommands = fieldData.hideCommands;
    mutedUsers = fieldData.mutedUsers.toLowerCase().replace(" ", "").split(",");
    disableMessageAnimations = fieldData.messageAnimation;
  	fadeMessages = fieldData.fadeMessages;
    chatStyle = fieldData.chatStyle;
  roundSetting = fieldData.borderRoundness;
  SetRoundness();
  InitializeGoal();
});

window.addEventListener('onEventReceived', function(obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    if (!(data.text.startsWith("!") && hideCommands === true) &&
        !mutedUsers.includes(data.nick)) {
        let color = data.displayColor !== "" ? data.displayColor : "#fff";
        let from = data.displayName;
        let message = buildMessage(data);;
        let badges = "",
            badge;
        for (let i = 0; i < data.badges.length; i++) {
            badge = data.badges[i];
            badges += `<img alt="" src="${badge.url}" class="badge"> `;
        }
      	
      if(chatStyle == 'bubbles'){AppendChat(from, color, message, badges);}
  	  else{addChatMessage(from, color, message, badges);}
      
        $(".meta").removeAttr("style");

        $(".sideBar").each(function() {
            var parentHeight = $(this).parent().outerHeight();
            $(this).outerHeight(parentHeight * .9);
        });
    }
});

function SetRoundness(){
      console.log(roundSetting + " " + chatStyle);
  if(roundSetting == "straight" && chatStyle == 'bubbles'){
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if(roundSetting == "soft" && chatStyle == 'bubbles'){
    shapeRoundness = 1;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if(roundSetting == "round" && chatStyle == 'bubbles'){
    shapeRoundness = 2;
    $("body").css("--roundness", shapeRoundness + 'em');
  }
  else if(roundSetting == "straight" && chatStyle == 'box'){
        console.log('yes');
    shapeRoundness = 0;
    $("body").css("--roundness", shapeRoundness + 'px');
  }
  else if(roundSetting == "soft" && chatStyle == 'box'){
    shapeRoundness = 25;
    $("body").css("--roundness", shapeRoundness + 'px');
  }
  else if(roundSetting == "round" && chatStyle == 'box'){
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

function AppendChat(from, color, message, badges){
  console.log(badges);
  messageID++;
  let messageAnimationStyle = "";

  const newChatMsg = $.parseHTML(`<div class="chatMsgWrap" data-from="${from}" data-id="${messageID}">
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
  
  if(disableMessageAnimations == false){
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
  
  if(fadeMessages == true){
   anime({
    targets: `.chatMsgWrap[data-id="${messageID}"]`,
    opacity: '0',
    duration: 500,
    delay : (hideMessageTime * 1000),
    easing: "linear",
    });
   }
  
}

function addChatMessage(from, color, message, badges) {
  messageID++;
  let messageAnimationStyle = "";

  const newChatMsg = $.parseHTML(`<div class="chatMsgWrap" style="margin-left: 100%" data-from="${from}" data-id="${messageID}">
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
  
  if(disableMessageAnimations == false){
    anime({
    targets: `.chatMsgWrap[data-id="${messageID}"]`,
    marginLeft: '0%',
    duration: 300,
    easing: "easeInOutQuad",
    });
  }
  
  if(fadeMessages == true){
   anime({
    targets: `.chatMsgWrap[data-id="${messageID}"]`,
    opacity: '0',
    duration: 500,
    delay : (hideMessageTime * 1000),
    easing: "linear",
    });
   }
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
  SubtractVector(x, y){
    return new Vector2D((this.x - x), (this.y - y));
  }
  RotateClockWise90Degrees(){
    return new Vector2D(this.y *(-1), this.x);
  }
  RotateAntiClockWise90Degrees(){
    return new Vector2D(this.y, this.x*(-1));
  }
  GetMagnitude(){
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  Normalize(){
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

function SetViewBox(){
  widgetWidth = $("#hexeumWidget").width();
  widgetHeight = $('#hexeumWidget').outerHeight();
  paddingBorder = thickness > (widgetHeight / 2) ? widgetHeight / 2 : thickness;
  $('#mainSVG').attr('viewBox', `0 0 ${widgetWidth} ${widgetHeight}`);
  $('#backdropSVG').attr('viewBox', `0 0 ${widgetWidth} ${widgetHeight}`)
}

function SetGoalAngles(){
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
  console.log(mainPathPoints);
}

function SetLog(){
  $('#log').width($('#mainSVG').width() - ((wigdetPadding + thickness) * 2));
  $('#log').height($('#mainSVG').height() - ((wigdetPadding + thickness) * 2));
}

function InitializeGoal() {
  SetViewBox();
  SetGoalAngles();
  SetLog();
  if(chatStyle != 'bubbles'){
    BuildSVG();
  }
  $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js");
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

function GetYIntercept(newX, newY, slope) {
  let coeff;
  if(isFinite(slope)){coeff = newY - (newX * slope);}
  else {coeff = newY - newX}
  return coeff;
}

function GetLineIntersections(firstPosition, firstSlope, secondPosition, secondSlope, firstCoefficient, secondCoefficient) {
  let x, y;
    
  if(firstSlope == secondSlope) return;
  
  if(!isFinite(firstSlope) && secondSlope == 0){
    x = firstPosition.x;
    y = secondCoefficient;
  }
  else if(!isFinite(secondSlope) && firstSlope == 0){
    x = secondPosition.x;
    y = firstCoefficient;
  }
  else if(!isFinite(firstSlope)){
    x = (firstPosition.x + firstCoefficient - secondCoefficient) / secondSlope;
    y = firstCoefficient;
  }
  else if(!isFinite(secondSlope)){
    x = (secondPosition.x + secondCoefficient - firstCoefficient) / firstSlope;
    y = secondCoefficient;
  }
  else {
    let slopeDifference = (firstSlope - secondSlope);
    x = (secondCoefficient - firstCoefficient) / slopeDifference;
    y = (firstSlope * x) + firstCoefficient;
  }
  return new Vector2D(x, y);
}

function MatchNumberSigns(numberToMatch, targetNumberSign){
  if(targetNumberSign < 0){return Math.abs(numberToMatch) * -1}
  else if(targetNumberSign > 0){return Math.abs(numberToMatch)}
  else {return 0;}
}

function GetSignedDirection(directionValue){
    if(directionValue < 0){return -1}
  else if(directionValue > 0){return 1}
  else {return 0;}
}

function CalculatePathDirection(){
  
}

//Accepts a path of Vector2D's
function BuildPath(pathPoints, innerPadding = 0,  roundness = 0) {
  let path;
  let scaledRoundness = 1 - ((innerPadding / (widgetHeight / 2)));
  let newRoundness = roundness * scaledRoundness;
  
  if (pathPoints.length < 3) return;

  let finalArcStart;
  let finalArcEnd;
   
  for (let i = 0; i < pathPoints.length; i++) {
    let currentPoint = pathPoints[i];
    let nextPoint = GetNextPoint(pathPoints, i);
    let previousPoint = GetPreviousPoint(pathPoints, i);
  
    let firstPointDifference =  currentPoint.SubtractVector(previousPoint.x, previousPoint.y);
    let firstVectorRotated = firstPointDifference.RotateAntiClockWise90Degrees().Normalize();
    
    firstVectorRotated = new Vector2D(GetSignedDirection(firstVectorRotated.x), GetSignedDirection(firstVectorRotated.y));
    
    let secondPointDifference = nextPoint.SubtractVector(currentPoint.x, currentPoint.y);
    let secondVectorRotated = secondPointDifference.RotateAntiClockWise90Degrees().Normalize();

    secondVectorRotated = new Vector2D(GetSignedDirection(secondVectorRotated.x), GetSignedDirection(secondVectorRotated.y));
        
    let firstLineAngle = 90 - CalculateAngleBetweenPoints(previousPoint, currentPoint, new Vector2D(currentPoint.x + 1, currentPoint.y));
    let firstX = Math.cos(DegreesToRadians(firstLineAngle)) * innerPadding;
    let firstY = Math.sin(DegreesToRadians(firstLineAngle)) * innerPadding;
    
    let firstXArc = Math.cos(DegreesToRadians(firstLineAngle)) * newRoundness;
    let firstYArc = Math.sin(DegreesToRadians(firstLineAngle)) * newRoundness;
    
    let firstSlope = CalculateSlope(previousPoint, currentPoint);
	    
    let secondLineAngle = 90 - CalculateAngleBetweenPoints(nextPoint, currentPoint, new Vector2D(currentPoint.x + 1, currentPoint.y));
    let secondX = Math.cos(DegreesToRadians(secondLineAngle)) * innerPadding;
    let secondY = Math.sin(DegreesToRadians(secondLineAngle)) * innerPadding;
    
    let secondXArc = Math.cos(DegreesToRadians(secondLineAngle)) * newRoundness;
    let secondYArc = Math.sin(DegreesToRadians(secondLineAngle)) * newRoundness;
    
    let secondSlope = CalculateSlope(nextPoint, currentPoint);
	
    firstX = MatchNumberSigns(firstX, firstVectorRotated.x);
    firstY = MatchNumberSigns(firstY, firstVectorRotated.y);
    secondX = MatchNumberSigns(secondX, secondVectorRotated.x);
    secondY = MatchNumberSigns(secondY, secondVectorRotated.y);
    firstXArc = MatchNumberSigns(firstXArc, firstVectorRotated.x);
    firstYArc = MatchNumberSigns(firstYArc, firstVectorRotated.y);
    secondXArc = MatchNumberSigns(secondXArc, secondVectorRotated.x);
    secondYArc = MatchNumberSigns(secondYArc, secondVectorRotated.y);
        
    let projectedCurrentPoint = new Vector2D(currentPoint.x + (firstX * Math.abs(firstVectorRotated.x)), currentPoint.y + firstY * Math.abs(firstVectorRotated.y));
    let projectedNextPoint = new Vector2D(currentPoint.x + (secondX * Math.abs(secondVectorRotated.x)), currentPoint.y + (secondY* Math.abs(secondVectorRotated.y)));
    
    let projectCurrentArcPoint = new Vector2D(projectedCurrentPoint.x + (firstXArc * Math.abs(firstVectorRotated.x)), projectedCurrentPoint.y + firstYArc * Math.abs(firstVectorRotated.y));
    let projectedNextArcPoint = new Vector2D(projectedNextPoint.x + (secondXArc * Math.abs(secondVectorRotated.x)), projectedNextPoint.y + (secondYArc* Math.abs(secondVectorRotated.y)));
    
    let fc = GetYIntercept(projectedCurrentPoint.x, projectedCurrentPoint.y, firstSlope);
    let sc = GetYIntercept(projectedNextPoint.x, projectedNextPoint.y, secondSlope);
    
    let fAc = GetYIntercept(projectCurrentArcPoint.x, projectCurrentArcPoint.y, firstSlope);
    let sAc = GetYIntercept(projectedNextArcPoint.x, projectedNextArcPoint.y, secondSlope);
    
    let intersection = GetLineIntersections(projectedCurrentPoint, firstSlope, projectedNextPoint, secondSlope, fc, sc);
    let arcIntersection = GetLineIntersections(projectCurrentArcPoint, firstSlope, projectedNextArcPoint, secondSlope, fAc, sAc);
    
    let firstDirection = secondPointDifference.RotateAntiClockWise90Degrees().Normalize();
    let secondDirection = firstPointDifference.RotateAntiClockWise90Degrees().Normalize();

    let firstInvertedDir = new Vector2D(firstDirection.x * -1, firstDirection.y *-1);
    let secondInvertedDir = new Vector2D(secondDirection.x * -1, secondDirection.y *-1);

    let arcPositionEnd = new Vector2D(arcIntersection.x + newRoundness * firstInvertedDir.x, arcIntersection.y + newRoundness * firstInvertedDir.y);
    let arcPositionStart =  new Vector2D(arcIntersection.x + newRoundness * secondInvertedDir.x, arcIntersection.y + newRoundness * secondInvertedDir.y);
        
    if (!path) {
      path = `M${intersection.x} ${intersection.y}`;
      finalArcStart = arcPositionStart;
      finalArcEnd = arcPositionEnd
    }
    else if(i == pathPoints.length - 1){
      path = path.concat(` L ${arcPositionStart.x} ${arcPositionStart.y} A${newRoundness},${newRoundness} 0 0 0 ${arcPositionEnd.x}, ${arcPositionEnd.y }`);
      path = path.concat(` L ${finalArcStart.x} ${finalArcStart.y} A${newRoundness},${newRoundness} 0 0 0 ${finalArcEnd.x}, ${finalArcEnd.y }`);
    }
    else {
      path = path.concat(` L ${arcPositionStart.x} ${arcPositionStart.y} A${newRoundness},${newRoundness} 0 0 0 ${arcPositionEnd.x}, ${arcPositionEnd.y }`);
    }
  }
  return path;
}

function GetOuterBorderPadding(){
  let padding = borderStyle == "detailed" ? outerBorderPadding : 0;
	if(padding < 0){return 0}
	else if(padding > thickness){return thickness}
	else return padding;
}

function GetInnerBorderPadding(){
  let innerPadding = borderStyle == "detailed" ? innerBorderPadding : 0;
  let padding = thickness - innerPadding ;
  if(padding < 0){return 0}
  else if(padding > thickness){return thickness}
  else return padding;
}

function GetMainThickness(){
  let mainThickness = thickness - GetOuterBorderPadding();
  if(mainThickness < 0){return 0}
  else if(mainThickness > thickness){return thickness}
  else return mainThickness;
}

function GetInsetThickness(){
  let insetThickness = borderStyle == "detailed" ? innerBorderPadding : 0;
  if(insetThickness < 0){return 0}
  else if(insetThickness > thickness){return thickness}
  else return insetThickness;
}

function BuildSVG() {
   
  let pathGlow = BuildPath(mainPathPoints, wigdetPadding + 2, shapeRoundness);
  let pathOutline = BuildPath(mainPathPoints, wigdetPadding, shapeRoundness);
  let pathMain = BuildPath(mainPathPoints, wigdetPadding+ GetOuterBorderPadding() , shapeRoundness);
  let pathInset = BuildPath(mainPathPoints, wigdetPadding + GetInnerBorderPadding() , shapeRoundness);
  let pathOutlineMask = BuildPath(mainPathPoints, wigdetPadding +(thickness - (GetMainThickness() / 2)), shapeRoundness);
  let pathMainMask = BuildPath(mainPathPoints, wigdetPadding + (thickness - (GetInsetThickness() / 2)), shapeRoundness);
  let pathInsetMask = BuildPath(mainPathPoints, wigdetPadding + thickness, shapeRoundness);
  let pathFill = BuildPath(mainPathPoints, wigdetPadding + 2, shapeRoundness);
  let glowMaskPath = BuildPath(mainPathPoints);
 
  if(widgetGlow){
  	$('#goalGlow').attr("d", pathGlow);
  }  
  if(borderStyle == "detailed"){
    $('#goalOutline').attr("d", pathOutline);
    $('#goalInset').attr("d", pathInset);
  }
  
  $('#goalBackdrop').attr("d", pathFill);
  $('#goalOutlineBounds').attr("d", pathOutline);
  $('#goalOutlineCutOff').attr("d", pathOutlineMask);
  
  $('#goalMain').attr("d", pathMain);
  $('#goalMainBounds').attr("d", pathOutline);
  $('#goalMainCutOff').attr("d", pathMainMask);
  
  $('#goalInsetBounds').attr("d", pathOutline);
  $('#goalInsetCutOff').attr("d", pathInsetMask);
  
  $('#glowBounds').attr("d", glowMaskPath);
  $('#glowCutOff').attr("d", pathInsetMask);
  
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