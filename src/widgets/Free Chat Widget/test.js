/*Class representing a 2D vector with commonly used vector operations
This solution requires a lot of vector operations and calculations 
so this class is used to make the code more readable and maintainable
*/
class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  AddVector2D(v2) {
    return new Vector2D(this.x + v2.x, this.y + v2.y)
  }
  AddVector(x, y) {
    return new Vector2D(this.x + x, this.y + y)
  }
  SubtractVector(x, y) {
    return new Vector2D(this.x - x, this.y - y)
  }
  RotateClockWise90Degrees() {
    return new Vector2D(this.y * -1, this.x)
  }
  RotateAntiClockWise90Degrees() {
    return new Vector2D(this.y, this.x * -1)
  }
  GetMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  Normalize() {
    return new Vector2D(this.x / this.GetMagnitude(), this.y / this.GetMagnitude())
  }
}


const borderWidth = 4; //Width of the desired border

//Add any number of vectors to create a path
const mainPathPoints = [
  new Vector2D(0, 0),
  new Vector2D(0, 1000),
  new Vector2D(800, 1000),
  new Vector2D(800, 0)
]

//Builds the SVG path and applies them to the SVG paths
function BuildSVG() {
  const pathMain = BuildPath(mainPathPoints)
  const pathMainMask = BuildPath(mainPathPoints, borderWidth)

  $('#goalMain').attr('d', pathMain)
  $('#goalMainBounds').attr('d', pathMain)
  $('#goalMainCutOff').attr('d', pathMainMask)
}

//Accepts a path of Vector2D's
function BuildPath(pathPoints, innerPadding = 0) {
  let path

  for (let i = 0; i < pathPoints.length; i++) {
    const currPoint = pathPoints[i]
    const nextPoint = GetNextPoint(pathPoints, i)
    const prevPoint = GetPreviousPoint(pathPoints, i)

    /*Difference between the current point and the previous point tells us how to go from
    the current point to the previous point. We then rotate this vector 90 degrees and then get
    the signed direction of the vector.
    */
    const firstPointDiff = currPoint.SubtractVector(prevPoint.x, prevPoint.y)
    let firstVecRotatedDir = firstPointDiff.RotateAntiClockWise90Degrees().Normalize()
    firstVecRotatedDir = new Vector2D(
      GetSignedDirection(firstVecRotatedDir.x),
      GetSignedDirection(firstVecRotatedDir.y)
    )

    /* Same as above but for the "next point" */
    const secondPointDiff = nextPoint.SubtractVector(currPoint.x, currPoint.y)
    let secondVecRotatedDir = secondPointDiff.RotateAntiClockWise90Degrees().Normalize()
    secondVecRotatedDir = new Vector2D(
      GetSignedDirection(secondVecRotatedDir.x),
      GetSignedDirection(secondVecRotatedDir.y)
    )

    /* Calculate the angle between the previous point, current point and a 
    point that is 1 unit to the right of the current point. Then this is subtracted from 90
    to imagine a new triangle with a side opposite that angle of length innerPadding.

    Then with triggernometry we can calculate hypotenuse of this imagined triangle which informs us
    of the first Y poisition of the projected line.

    Then, using a mirrored triangle to the above imagined triangle, we can calculate the 
    adjacent side of the triangle which informs us of the first X position of the projected line.

    The slope of the line between the previous point and the current point is also calculated.
    */
    const firstLineAngle =
      90 -
      CalculateAngleBetweenPoints(prevPoint, currPoint, new Vector2D(currPoint.x + 1, currPoint.y))
    let firstX = Math.cos(DegreesToRadians(firstLineAngle)) * innerPadding
    let firstY = Math.sin(DegreesToRadians(firstLineAngle)) * innerPadding
    const firstSlope = CalculateSlope(prevPoint, currPoint)

    /* Same as above but with the next point, current point and that is 1 unit to 
    the right of the current point  */
    const secondLineAngle =
      90 -
      CalculateAngleBetweenPoints(nextPoint, currPoint, new Vector2D(currPoint.x + 1, currPoint.y))
    let secondX = Math.cos(DegreesToRadians(secondLineAngle)) * innerPadding
    let secondY = Math.sin(DegreesToRadians(secondLineAngle)) * innerPadding
    const secondSlope = CalculateSlope(nextPoint, currPoint)

    //Match the signs of the numbers
    firstX = MatchNumberSigns(firstX, firstVecRotatedDir.x)
    firstY = MatchNumberSigns(firstY, firstVecRotatedDir.y)
    secondX = MatchNumberSigns(secondX, secondVecRotatedDir.x)
    secondY = MatchNumberSigns(secondY, secondVecRotatedDir.y)

    /* This get's the actual positions of where we will project the lines by adding the firstX and
    firstY to the current point and the secondX and secondY to the next point

    The the X and Y values are multipled by the directional vector to ensure the lines are projected
    in the correct direction
    */
    const projectedCurrentPoint = new Vector2D(
      currPoint.x + firstX * Math.abs(firstVecRotatedDir.x),
      currPoint.y + firstY * Math.abs(firstVecRotatedDir.y)
    )
    const projectedNextPoint = new Vector2D(
      currPoint.x + secondX * Math.abs(secondVecRotatedDir.x),
      currPoint.y + secondY * Math.abs(secondVecRotatedDir.y)
    )

    /*
    Here using the projected points to get the Y-intercept of the projected lines
    We need these in order to solve the point of intersection for these lines
    */
    const fc = GetYIntercept(projectedCurrentPoint.x, projectedCurrentPoint.y, firstSlope)
    const sc = GetYIntercept(projectedNextPoint.x, projectedNextPoint.y, secondSlope)

    //Calculate the point of intersection between the two projected lines
    const intersection = GetLineIntersections(
      projectedCurrentPoint,
      firstSlope,
      projectedNextPoint,
      secondSlope,
      fc,
      sc
    )

    //With the intersection point we can add this to the path we're building
    if (!path) {
      path = `M${intersection.x} ${intersection.y}`
    } else {
      path = path.concat(`L ${intersection.x} ${intersection.y}`)
    }
  }
  return path
}

function GetNextPoint(pathPoints, currentIndex) {
  if (currentIndex + 1 >= pathPoints.length) {
    return pathPoints[0]
  } else return pathPoints[currentIndex + 1]
}

function GetPreviousPoint(pathPoints, currentIndex) {
  if (currentIndex - 1 < 0) {
    return pathPoints[pathPoints.length - 1]
  } else return pathPoints[currentIndex - 1]
}

function CalculateSlope(p1, p2) {
  let yVal = p2.y - p1.y
  let xVal = p2.x - p1.x
  return yVal / xVal
}

//Get the translated coefficient of a line
function GetYIntercept(newX, newY, slope) {
  let coeff
  if (isFinite(slope)) {
    coeff = newY - newX * slope
  } else {
    coeff = newY - newX
  }
  return coeff
}

/* This is basically just the point of intersection formula to get 
the vector position of an intersection between two lines */
function GetLineIntersections(
  firstPosition,
  firstSlope,
  secondPosition,
  secondSlope,
  firstCoefficient,
  secondCoefficient
) {
  let x, y

  if (!isFinite(firstSlope) && secondSlope == 0) {
    x = firstPosition.x
    y = secondCoefficient
  } else if (!isFinite(secondSlope) && firstSlope == 0) {
    x = secondPosition.x
    y = firstCoefficient
  } else if (!isFinite(firstSlope)) {
    x = (firstPosition.x + firstCoefficient - secondCoefficient) / secondSlope
    y = firstCoefficient
  } else if (!isFinite(secondSlope)) {
    x = (secondPosition.x + secondCoefficient - firstCoefficient) / firstSlope
    y = secondCoefficient
  } else {
    let slopeDifference = firstSlope - secondSlope
    x = (secondCoefficient - firstCoefficient) / slopeDifference
    y = firstSlope * x + firstCoefficient
  }
  return new Vector2D(x, y)
}

//Converts a number to a negative or positive number based on the target number sign
function MatchNumberSigns(numberToMatch, targetNumberSign) {
  if (targetNumberSign < 0) {
    return Math.abs(numberToMatch) * -1
  } else if (targetNumberSign > 0) {
    return Math.abs(numberToMatch)
  } else {
    return 0
  }
}

//Returns the sign of a number
function GetSignedDirection(directionValue) {
  if (directionValue < 0) {
    return -1
  } else if (directionValue > 0) {
    return 1
  } else {
    return 0
  }
}

//Calculate the direction between two points and normalize it
function GetVectorDirection(v1, v2) {
  let direction = new Vector2D(v2.x - v1.x, v2.y - v1.y)
  let magnitude = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2))
  let directonNormalized = new Vector2D(direction.x / magnitude, direction.y / magnitude)
  return directonNormalized
}

//Takes three vector positions and calculates the angle between them
function CalculateAngleBetweenPoints(p1, p2, p3) {
  let a = new Vector2D(p1.x - p2.x, p1.y - p2.y)
  let b = new Vector2D(p3.x - p2.x, p3.y - p2.y)
  let abProduct = a.x * b.x + a.y * b.y
  let magnitudeA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2))
  let magnitudeB = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2))
  let radians = Math.acos(abProduct / (magnitudeA * magnitudeB))
  return RadiansToDegrees(radians)
}

//Converts radians to degrees
function RadiansToDegrees(radians) {
  let pi = Math.PI
  return radians * (180 / pi)
}

//Converts degrees to radians
function DegreesToRadians(degrees) {
  let pi = Math.PI
  return degrees * (pi / 180)
}
