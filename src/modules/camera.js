
export {getRelativeCoords, keyMap, Camera };



function getRelativeCoords(x, y, camera)
{
    
    let xTemp = x < camera.xMin ? x - camera.xMin : Math.abs(camera.xMin - x);
    let yTemp = y < camera.yMin ? y - camera.yMin : Math.abs(camera.yMin - y);
    xTemp = (xTemp*window.innerWidth)/(camera.xRange * 2);
    yTemp = (yTemp*window.innerHeight)/(camera.yRange * 2);
    return {x : xTemp, y : yTemp};
} 




//KeyMap Translates Keys To Actions.
const keyMap = 
{
    "KeyD" : 'Right',
    "ArrowRight" : 'Right',
    "ArrowLeft" : 'Left',
    "KeyA" : 'Left',
    
    "KeyW" : 'Up',
    "ArrowUp" : 'Up',
    "KeyS" : 'Down',    
    "ArrowDown" : 'Down',
    "Minus" : "ZoomOut",
    "Add" : "ZoomIn",
    "Equal" : "ZoomIn"
};



class Camera {

    speed = 50;
    _actionBuffer = [];
    _controlStates = {"Up" : false, "Right" : false, "Down" : false, "Left" : false};
    

    
    
    constructor(x, y, xRange, yRange){
        this.x = x;
        this.y = y;
        this.xRange = (xRange / 2);
        this.yRange = (yRange / 2);
        this.zoomScale = 1;
        
        let ControlHorizontal = false;
        let ControlVertical = false;
        let didZoom = false;
        this.afterCameraZoomExecute = [];
        
        this.xMin = this.x - this.xRange;
        this.xMax = this.x + this.xRange;
        this.yMin = this.y - this.yRange;
        this.yMax = this.y + this.yRange;
    
    }

    

    _keyUp(event)
    {
        //Update State To Say Key Is No Longer Being Pressed
        if(!keyMap[event.code])
        {
            return;
        }
        else if(keyMap[event.code] == 'Up')
        {
            this._controlStates["Up"] = false;
        }
        else if(keyMap[event.code] == 'Right')
        {
            this._controlStates["Right"] = false;
        }
        else if(keyMap[event.code] == 'Down')
        {
            this._controlStates["Down"] = false;
        }
        else if(keyMap[event.code] == 'Left')
        {
            this._controlStates["Left"] = false;
        }
        return;
    }
    _keyDown(event)
    {
        //Process The Input
        //Check If Key In Key Map
        //Update State To Say Key Is Being Pressed And Add Action To actionBuffer.
        if(!keyMap[event.code])
        {
            return;
        }
        else if(keyMap[event.code] == 'Up')
        {
            this._actionBuffer.push("Up");
            this._controlStates["Up"] = true;
        }
        else if(keyMap[event.code] == 'Right')
        {
            this.xMin = this.x - this.xRange;
            this._controlStates["Right"] = true;
        }
        else if(keyMap[event.code] == 'Down')
        {
            this._actionBuffer.push("Down");
            this._controlStates["Down"] = true;
        }
        else if(keyMap[event.code] == 'Left')
        {
            this._actionBuffer.push("Left");
            this._controlStates["Left"] = true;
        }
        else if(keyMap[event.code] == "ZoomOut")
        {
            this.zoomScale -= this.zoomScale * 0.1;
            this.didZoom = true;
            this.xRange += this.xRange * 0.1;
            this.yRange += this.yRange * 0.1
        }
        else if(keyMap[event.code] == "ZoomIn")
        {
            this.zoomScale += this.zoomScale * 0.1;
            this.didZoom = true;
            this.xRange -= this.xRange * 0.1;
            this.yRange -= this.yRange * 0.1
            
        }
        return;
    }
    setHorizontalControl(allow)
    {
        if(allow === true)
        {            
            if(!this.ControlHorizontal && !this.ControlVertical)
            {
                window.addEventListener('keydown', event => this._keyDown(event));
                window.addEventListener('keyup', event => this._keyUp(event));
            }
            this.ControlHorizontal = true;
        }
        
        
    }
    setVerticalControl(allow)
    {
        if(allow === true)
        {            
            if(!this.ControlHorizontal && !this.ControlVertical )
            {
                window.addEventListener('keydown', event => this._keyDown(event));
                window.addEventListener('keyup', event => this._keyUp(event));
            }
            this.ControlVertical = true;
        }
    }
    update()
    {
            //Move Camera Based On If Correct Button Is Held Down Right Now.
            if(this.ControlHorizontal)
            {
                this._updateHorizontal(this._controlStates["Left"] ? "Left" : false);
                this._updateHorizontal(this._controlStates["Right"] ? "Right" : false);        
            }
            if(this.ControlVertical)
            {
                this._updateVertical(this._controlStates["Up"] ? "Up" : false);
                this._updateVertical(this._controlStates["Down"] ? "Down" : false);
            }
            
            

        //Move Camera Based On If Button Was Pressed In Between Draw Calls.
        let action;
        while((action = this._actionBuffer.shift()))
        {
            if(this.ControlHorizontal)
            {
                this._updateHorizontal(action);
            }
            if(this.ControlVertical)
            {
                this._updateVertical(action);
            }
        }
        
        //Update The Minimum X And Y Values To Be Drawn On Screen.
        this.xMin = this.x - this.xRange;
        this.yMin = this.y - this.yRange;

        if(this.didZoom)
        {
            for(let i = 0; i < this.afterCameraZoomExecute.length; i++)
            {
                this.afterCameraZoomExecute[i]();
            }
            this.didZoom = false;
        }
        

    }
    _updateHorizontal(action)
    {
        console.log(action);
        this.x += (action == "Right" ? this.speed*(0.5/this.zoomScale) : 0);
        this.x += (action == "Left"  ? -this.speed*(0.5/this.zoomScale) : 0);
    }
    _updateVertical(action)
    {
        this.y += (action == "Up" ? -this.speed*(0.5/this.zoomScale) : 0);
        this.y += (action == "Down" ? this.speed*(0.5/this.zoomScale) : 0);
    }
    addExecuteAfterZoom(callback)
    {
        this.afterCameraZoomExecute.push(callback);
    }
    switchCamera()
    {
        //Clean Up The State Of The Camera Before Switching To A Different One.
        this._controlStates["Up"] = false;
        this._controlStates["Right"] = false;
        this._controlStates["Down"] = false;
        this._controlStates["Left"] = false;
        //Remove Event Listeners.
        window.removeEventListener('keydown', function(e){this.keyDown(e)});
        window.removeEventListener('keyup', function(e){this.keyUp(e)});
        
    }

}