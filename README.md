<h1>Do not install the current version! Rework in progress</h1>
<p>
I am making some changes in the design and functionality. 
Keep in mind that this is more of a project for training and tests. 
For the same reason, some strange solutions can be noticed in the project
</p>

<h4>Current view. I will change it as the project is ready:</h4>
<span>
<img height="350px" src="https://user-images.githubusercontent.com/59813353/206973787-7b96ad85-b814-42c1-b0a7-916f5f00c510.png"/>
</span>
<span>
<img height="350px" src="https://user-images.githubusercontent.com/59813353/206973796-207d8d94-d30f-4bce-ae67-4f60011e4658.png"/>
</span>

<h3>The original repo available at <a href="https://github.com/luc-github/ESP3D-WEBUI">here</a></h3><br/>

<br/>
<h1>Changes for users:</h1>
<ul>
<li>[ ] Keyboard shortcuts </li>
<li>[ ] Visual display of parameters</li>
<li>[ ] Information about the current task</li>
<li>[x] Dark/Light theme</li>
<li>[x] Automatic file renaming in 8.3 for Marlin</li>
</ul>

<br/>
<h1>Changes for devs:</h1>
<ul>
<li>[ ] Adding objectness to the JS code</li>
<li>[x] Translating JS to ES6</li>
<li>[x] Added scss support</li>
<li>[x] Deleted bootstrap</li>
</ul>

<p>
I would be very glad of any help
</p>

<p>
My printer <b>Ender3/4.2.2/Marlin.</b><br/>
If someone is interested in how I connected esp-01, then write, I will try to write my experience in the instructions
</p>

<h1>Notes:</h1>
<ul>
  <li>
  To transfer files over the air, you need to comment out the line in Configuration_adv:<br/>
    <code>//#define SDCARD_READONLY                   // Read-only SD card (to save over 2K of flash)</code><br/>
    In stock, this has already been done
  </li>
 <br/>
<h3><a href="https://www.thingiverse.com/thing:5629082">Here</a> is my 3d models for esp-01 case on Ender 3</h3><br/>
<img height="300" src="https://cdn.thingiverse.com/assets/08/52/0e/4e/91/large_display_27d14aff-7db4-4c82-8b3a-da9ab3cf70b2.jpg" alt="Case print sample"/>
