/**
 * lc-mouseDrag.js - Vanilla javascript (ES6) function enabling drag scrolling on desktop
 * Version: v1.0
 * Author: Luca Montanari aka LCweb
 * Website: https://lcweb.it
 * Licensed under the MIT license
 */

(function() { 
   "use strict";

    /* prevent multiple script inits */ 
    if(typeof(window.lc_mouseDrag) == 'function') {
        return true;
    }


    /* 
     * Public class initializing the plugin for each targeted element 
     * suggested ratio = 0.3
     */
    window.lc_mouseDrag = function(attachTo, ratio = 0.3, ignoreX = false, ignoreY = false) {
        if(!attachTo) {
            return console.error('You must provide a valid selector or DOM object as first argument');
        }

        
        /* get elements to attach event to */
        const get_elems = function(selector) {
            if(typeof(selector) != 'string') {
                return (selector instanceof Element) ? [selector] : Object.values(selector);   
            }

            // clean problematic selectors
            (selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(function(n) {
                selector = selector.replace(n, '[id="' + n.replace("#", "") + '"]');
            });

            return document.querySelectorAll(selector);
        };

        
        /* perform */
        const mouseDrag = function($elem) { 
            let trackX = (!ignoreX) ? true : false,
                trackY = (!ignoreY) ? true : false,

                curDown = false,
                curYPos = 0,
                curXPos = 0,

                startScrollY 	= 0,
                startScrollX 	= 0,
                scrollDif   	= 0,
                animation       = null,
                sms_timeout     = null;    


            $elem.addEventListener('mousedown', (e) => {
                if(sms_timeout) {
                    clearTimeout(sms_timeout);
                }
                curDown = true;

                startScrollY = parseInt($elem.scrollTop, 10);
                startScrollX = parseInt($elem.scrollLeft, 10);
                curYPos = e.offsetY;
                curXPos = e.offsetX;
            }); 


            $elem.addEventListener('mouseup', (e) => {
                curDown = false;
                if(!ratio) {
                    return true;    
                }
                
                // smooth scroll
                let currScrollY = $elem.scrollTop,
                    scrollDiffY = (startScrollY - currScrollY) * -1,
                    newScrollY = currScrollY + ( scrollDiffY * ratio),

                    currScrollX = $elem.scrollLeft,
                    scrollDiffX = (startScrollX - currScrollX) * -1,
                    newScrollX = currScrollX + ( scrollDiffX * ratio);

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
            });


            $elem.addEventListener('mousemove', (e) => {
                if(curDown === true){
                    if(animation) {
                        animation.pause();    
                    }

                    let scroll_obj = {
                        behavior: 'auto'
                    };
                    if(trackY) {
                        scroll_obj.top = startScrollY + (curYPos - e.offsetY);
                    }
                    if(trackX) {
                        scroll_obj.left = startScrollX + (curXPos - e.offsetX);
                    }

                    $elem.scroll(scroll_obj);
                }

                if(sms_timeout) {
                    clearTimeout(sms_timeout);
                }
                sms_timeout = setTimeout(() => {
                    curDown = false;
                }, 50);    
            });

        };
        

        // init
        get_elems(attachTo).forEach(($el) => {

            // not for touch mobile devices
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('lc_mousedrag_is_mobile');  
                return true;
            }

            mouseDrag($el);
        });
    };
})();    