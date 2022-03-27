
The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/tile.js
```

A running demo can be seen here: -

Coming Soon


A sharing token of that example flow is: -

Coming Soon


NOTE: Visibility based on page conditions is respected.



# tiles - out of box extension, no special classname


## Functionality

Provides all the standard function, look & feel of the OOB tile but with the addition of the ability to display a glyphicon
or an image in the center of the tile and to have a dissabled overlay

## The 2nd display column: -

### glyphicon

If its value contains "glyphicon" then it is displayed as a <span> whose class is set as "mw-tiles-item-icon glyphicon <<the value from the property>>">

So setting the value to "glyphicon-user" will result in the elements class being "mw-tiles-item-icon glyphicon glyphicon-user".

Implement the "mw-tiles-item-icon" class to configure its display e.g.

````
.mw-tiles-item-icon {
    margin: auto;
    color: #000;
    font-size: 2rem;
}
````

### https:// or http://

If its value contains either "https://" or "http://"then  is displayed as a <img> whose class is set as "mw-tiles-item-image" and whose "src" is set to the value of the property

So setting the value to "https://www.mydomain.com/img.png" will result in the element being rendered as: -

````
<img 
  className="mw-tiles-item-image"
  src="https://www.mydomain.com/img.png"
/>
````
Implement the "mw-tiles-item-image" class to configure its display e.g.

````
.mw-tiles-item-icon {
    margin: auto;
    width: 10rem;
}
````

## enabled display column

If you have a display column whose property name is "enabled" and is a boolean 
then this col controls displaying an overlay on the tile.

The overlay displays text label.

The content of the label is defined in an attribute named "disabledMessage".

The style of the overlay and text are defined in the player in the classes mw-tiles-item-overlay & mw-tiles-item-overlay-text

e.g.  semi-transparent, on top and covering the whole tile.  The text is red and 45 degrees accross the tile

````
.mw-tiles-item-overlay {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flexDirection: column;
            zIndex: 1000;
            background: rgba(225, 225, 225, .8);
        }
        
        .mw-tiles-item-overlay-text {
            margin: auto;
            transform: rotate(45deg);
            font-size: 1.6rem;
            color: #f00;
        }
````

## Notes

I found these styles improved the tiles appearance: -

````
        .mw-bs .mw-tiles-items {
            justify-content: center;
        }
        
        .mw-bs .mw-tiles-item-container {
            margin-left: 1rem;
        }
````


