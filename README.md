# cg-web-demo

This is a web demo to demonstrate how to render 3D objects using only 2D capabilities.

Here are the operations performed:

1. Create a geometry
2. Transform the points of the geometry
3. Project the points of the geometry from 3D to 2D
4. Compute triangles lighting
5. Draw triangles

In this demo, the triangles are directly filled with HTML 5 canvas drawing primitives, and not performed via the scanline method. Therefore, we do not use a Z buffer nor keep any information about depth, and only render all triangles after sorting them from back to front, also know as the painter's method.

The demo works on mobile phone too, so feel free to give it a try.

Link to the demo: https://tanukisharp.github.io/cg-web-demo/
