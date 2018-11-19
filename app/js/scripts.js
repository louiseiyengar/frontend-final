// --- Initialize Global variables and constants --//
const closeNote = `
<div class="closer" href="#">
<div class="closex">✖︎</div>
</div><div> </div>
`
var boolNoteExists = false;
var isDown = false;

// --- Functions Called Elsewhere --- //
function addTextUnderline (elem) {
    elem.classList.remove("footnote");
    elem.classList.add('footnote-active');
}

function removeTextUnderline (elem) {
    elem.classList.remove("footnote-active");
    elem.classList.add('footnote');
}

// Footnotes - process underlining text and creating Note Card --- //
var processFootnotes = function () {
    var footnotes = document.querySelectorAll('.footnum');
    Array.from(footnotes).forEach(function(element) {
        element.addEventListener('mouseover', showFootnote, false);
        element.addEventListener('mouseout', removePrevFootnotes, false);
        element.addEventListener('click', makeTSEliotNote, false);
    });

    function showFootnote() {
        if (!boolNoteExists) {
            removePrevFootnotes();
            showUnderlineArea();
        }
    }

    function showUnderlineArea() {
        let footnoteText = event.target.parentElement;
        if (!(footnoteText.matches('.footnum'))) {
            addTextUnderline(footnoteText);
        }
    }

    function removePrevFootnotes() {
        Array.from(footnotes).forEach(function(element) {
            let footnoteText = element.parentElement;
            if (!(footnoteText.matches('.footnum'))) {
                removeTextUnderline(footnoteText);
            }
            if (element.matches('.chosen')) {
                addTextUnderline(footnoteText);
            }
        });
    }
}

// --- Create Note Card if footnote is clicked -- //
function makeTSEliotNote() {
    var createNoteCard = function () {
        if (!boolNoteExists) {
            var footnum = event.target;
            if (footnum.matches('.footnum') && (!(footnum.matches('.chosen')))) {            
                addTextUnderline(footnum.parentElement);
                footnum.classList.add('chosen');
                var infoNote = document.createElement('div');
                infoNote.classList.add('infoNote');

                footnoteNum = footnum.innerHTML - 1;
                infoNote.innerHTML = createNoteText();
                document.querySelector('body').append(infoNote);
    
                let closer = document.querySelector('.closer');

                closer.addEventListener('click', function() {
                    closeInfoNote();
                });

                infoNote.addEventListener('mousedown', function(e) {
                    if (!(e.target.matches('.closex'))) {
                        isDown = true;
                        moveInfoNote(e);
                    }
                }, true);
            }
            boolNoteExists = true;
        }

        // -- Text for Notecard from JSON object in text.js -- //
        function createNoteText() {
            let text = closeNote;
            text += "<h2>Note for footnote: " + (parseInt(footnoteNum) + 1) + "</h2>";
            text += "<div class='notetext'>"
            if ("eliot" in TextOfFootnotes[footnoteNum]) {
                text +=  "<h3>Eliot's note: </h3><p>" + TextOfFootnotes[footnoteNum]["eliot"] + "</p>";
            }
            if ("context" in TextOfFootnotes[footnoteNum]) {
                text += "<h3>Context note: </h3><p>" + TextOfFootnotes[footnoteNum]["context"] + "</p></div>";
            }
            return text;
        }

        // -- Processing when X is clicked in Note Card -- //
        function closeInfoNote() {
            boolNoteExists = false;
            infoNote.remove();
            footnum.classList.remove('chosen');
            removeTextUnderline(footnum.parentElement);
        }
        
        // -- Processing to move card around screen if mousedown and moved on card -- //
        function moveInfoNote(e) {
            var offset = [
                infoNote.offsetLeft - e.clientX,
                infoNote.offsetTop - e.clientY
            ]
        
            document.addEventListener('mouseup', function() {
                isDown = false;
            }, true);
        
            document.addEventListener('mousemove', function(event) {
                event.preventDefault();
                if (isDown) {
                    infoNote.style.marginLeft = 0;
                    infoNote.style.left = (event.clientX + offset[0]) + 'px';
                    infoNote.style.top  = (event.clientY + offset[1]) + 'px';
                }
            }, true);
        }
    }

    createNoteCard();
}

processFootnotes();
