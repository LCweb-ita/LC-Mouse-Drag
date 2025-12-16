/**
 * lc-mouseDrag.js - Vanilla javascript (ES6) function enabling drag scrolling on desktop
 * Version: v1.1.0
 * Author: Luca Montanari (LCweb)
 * Website: https://lcweb.it
 * Licensed under the MIT license
 */

(function() {
    "use strict";

    /* prevent multiple script inits */
    if (typeof window.lc_mouseDrag === 'function') {
        return true;
    }

    
    /* 
     * Public class initializing the plugin for each targeted element 
     * suggested ratio = 0.3
     */
    window.lc_mouseDrag = function(attachTo, ratio = 0.3, ignoreX = false, ignoreY = false) {
        if (!attachTo) {
            return console.error('You must provide a valid selector or DOM object as first argument');
        }

        
        /* get elements to attach event to */
        const get_elems = function(selector) {
            if(typeof selector !== 'string') {
                return (selector instanceof Element) ? [selector] : Object.values(selector);
            }

            (selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(function(n) {
                selector = selector.replace(n, '[id="' + n.replace("#", "") + '"]');
            });

            return document.querySelectorAll(selector);
        };

        
        /* perform */
        const mouseDrag = function($elem) {
            let trackX = !ignoreX,
                trackY = !ignoreY,

                isDragging = false,
                pointerId = null,

                startYPos = 0,
                startXPos = 0,

                startScrollY = 0,
                startScrollX = 0,

                animation = null;

            
            /* pointer down */
            $elem.addEventListener('pointerdown', (e) => {
                if(e.pointerType !== 'mouse') {
                    return;
                }
                e.preventDefault();

                isDragging = true;
                pointerId = e.pointerId;

                startScrollY = $elem.scrollTop;
                startScrollX = $elem.scrollLeft;

                startYPos = e.clientY;
                startXPos = e.clientX;

                $elem.setPointerCapture(pointerId);
            });

            
            /* pointer move */
            $elem.addEventListener('pointermove', (e) => {
                if(!isDragging || e.pointerId !== pointerId) {
                    return;
                }

                if(animation) {
                    animation.pause();
                }

                let scroll_obj = {
                    behavior: 'auto'
                };

                if(trackY) {
                    scroll_obj.top = startScrollY + (startYPos - e.clientY);
                }
                if(trackX) {
                    scroll_obj.left = startScrollX + (startXPos - e.clientX);
                }

                $elem.scroll(scroll_obj);
            });

            
            /* pointer up / cancel */
            const endDrag = (e) => {
                if(!isDragging || e.pointerId !== pointerId) {
                    return;
                }

                isDragging = false;
                $elem.releasePointerCapture(pointerId);
                pointerId = null;

                if(!ratio) {
                    return;
                }

                let currScrollY = $elem.scrollTop,
                    scrollDiffY = (startScrollY - currScrollY) * -1,
                    newScrollY = currScrollY + (scrollDiffY * ratio),

                    currScrollX = $elem.scrollLeft,
                    scrollDiffX = (startScrollX - currScrollX) * -1,
                    newScrollX = currScrollX + (scrollDiffX * ratio);

                let scroll_obj = {
                    behavior: 'smooth'
                };
                if(trackY) {
                    scroll_obj.top = newScrollY;
                }
                if(trackX) {
                    scroll_obj.left = newScrollX;
                }

                animation = $elem.scroll(scroll_obj);
            };

            $elem.addEventListener('pointerup', endDrag);
            $elem.addEventListener('pointercancel', endDrag);
        };

        
        // init
        get_elems(attachTo).forEach(($el) => {

            // run only on devices with a real mouse
            if(window.matchMedia('(pointer: fine)').matches === false) {
                document.body.classList.add('lc_mousedrag_is_touch');
                return true;
            }

            mouseDrag($el);
        });
    };
})();
