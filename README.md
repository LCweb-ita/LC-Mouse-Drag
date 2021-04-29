# Drag-n-scroll also on desktop devices, by LCweb

No dependencies **vanilla javascript function** to easily implement a nice drag-to-scroll effect using dsektop mouse.

 - optionally set a mobile-device-like smooth drag animation on drag end 
 - optionally control only one scroll axis
 
Everything in **less than 2KB**.


<br/>


## Installation & Usage

1. include lc-mouse-drag.min.js

2. call the function targeting one/multiple page elements and eventually fill optional parameters.<br/><br/>NB: first parameter may be a textual selector or a DOM object (yes, also jQuery objects)


```
<script type="text/javascript">
lc_mouseDrag('.target_elements', 
    0.3,    // (float) ending dragging animation delta. 0.3 by default, 0 to disable. 
                0.3 means the dragged distance will be increased by 30% on mouse up with a smooth animation
    
    
    false,  // (bool) whether to ignore X-axis dragging
    false   // (bool) whether to ignore Y-axis dragging
);
</script>
```


**NB:** Is essential to have a proper HTML/CSS setup in order to have it working.<br/>
For example, on desktop, you must use *overflow: hidden;* on the target element.

Please check the demo.html code to better understand. <br/>
The function also sets an utility class on the BODY element to know if page is being viewed on a mobile device (not needing this function).

This is the CSS code used in the demo to apply the proper CSS only on affected devices


```
<style>
body:not(.lc_mousedrag_is_mobile) #inner {
    overflow: hidden;
    cursor: grab;
} 
</style>
```


* * *


Copyright &copy; Luca Montanari - [LCweb](https://lcweb.it)
