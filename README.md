
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

Provides all the standard function, look & feel of the OOB tile but with the addition of various extended layouts and styles.

It supports both the concept of display columns to map item fields to tile elements and a static Type defintion.

Searching and pagination are also supported.


## Component Configuration

### Data Source
Points to a list of objects, each one representing a tile.

Can be any Type but if not using this static structure, you will need to use DisplayColumns or attributes to tell the component how to map the properties.

The Tile type is defined as so: -
````
{
        "developerName": "Tile",
        "developerSummary": "The definition of a tile",
        "elementType": "TYPE",
        "properties": [
            {
                "contentType": "ContentString",
                "developerName": "Title",
            },
            {
                "contentType": "ContentString",
                "developerName": "Image",
            },
            {
                "contentType": "ContentString",
                "developerName": "Details",
            },
            {
                "contentType": "ContentString",
                "developerName": "LinkLabel",
            },
            {
                "contentType": "ContentString",
                "developerName": "BannerColour",
            },
            {
                "contentType": "ContentList",
                "developerName": "ChildLinks",
                "typeElementDeveloperName": "Tile",
            },
            {
                "contentType": "ContentString",
                "developerName": "ENUM",
                "id": null,
            },
            {
                "contentType": "ContentList",
                "developerName": "MenuLinks",
                "typeElementDeveloperName": "Tile",
            },
            {
                "contentType": "ContentString",
                "developerName": "ItemValue",
            },
            {
                "contentType": "ContentContent",
                "developerName": "Content",
            },
            {
                "contentType": "ContentContent",
                "developerName": "Summary",
            }
        ]
    }
````

### Model

A single item of the same type as the datasource.

### Data Presentation

Se each tile type for it's specific mappings.

### Attributes

#### TileType
String.
The name of a tile type class from the following types below.
Defaults to a standard tile (DefaultTile).

#### TilesPerRow
Number.
The default number of tiles to show per row.
Defaults to 4.

#### UriField
If specified the tile's value attribute specified is tested for a value and if found that value is opened in a new tab

# Tile Types

## DefaultTile





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


