/*
=== SECTIONS ===
Overview
    A location for quick access to things like recently worked on items, players, etc.
World Objects
    Where the magic happens. For creating and viewing objects such as locations, NPCs, deities, etc.
    The types of objects are as follows:
        'Building', 'home-3'
        'Celestial Body', 'moon'
        'Character', 'user'
        'Condition', 'alert'
        'Conflict', 'sword'
        'Country', 'government'
        'Currency', 'coins'
        'Deity', 'psychotherapy'
        'Document', 'file-paper-2'
        'Ethnicity', 'walk'
        'Geographic Location', 'landscape'
        'Item', 'key-2'
        'Landmark', 'building-2'
        'Language', 'character-recognition'
        'Material', 'box-3'
        'Military', 'honour'
        'Myth', 'book-2'
        'Natural Law', 'flashlight'
        'Organization', 'team'
        'Profession', 'account-box'
        'Religion', 'sparkling-line'
        'Rule', 'dice'
        'Settlement', 'community'
        'Species', 'aliens'
        'Spell', 'fire'
        'Technology', 'flask'
        'Title', 'vip-crown'
        'Tradition', 'chat-history'
        'Vehicle', 'riding-line'
Maps
    Where maps are created, including things like image upload and POI tick creator
History
    A location for creating timelines, calendars, etc.
Campaigns
    A location for creating and viewing campaigns
    Should have a section for allowing players to view certain world objects at the GM's approval
    Has a World Handout section for creating a general overview of the setting for your players
Writing Tools
    A section for creating things like brainstorming pages, to-do lists, etc.
Files
    Contains quick access to things like images, as well as the actual markdown files themselves
*/

const explorer = document.querySelector('#explorer');
const menu = document.querySelector('#menu');

//switch menus on clicking their respective button
explorer.addEventListener('click', e => {
    if(e.target.className == 'explorer-button') {
        const menuID = e.target.getAttribute('href');
        const activeMenu = menu.querySelector('div[data-active=true]');
        const newActive = menu.querySelector(menuID);
        if(activeMenu !== newActive) {
            activeMenu.dataset.active = false;
            newActive.dataset.active = true;
        }
        const menuTitle = newActive.querySelector('.small-header');
        document.title = `Chisel | Quill - ${menuTitle.innerText}`;
    }
});

//select boxes code
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
            }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect); 



const testing = new BuilderLandmark();
testing.pushHTML();
getInputs();