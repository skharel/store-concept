Built using tutorial for redux from Tyler Mcginnis course. Pretty awesome course if you want to learn Redux:
https://learn.tylermcginnis.com/

1. Just to see basics of store (JS) code only run:

   run `node app.js`

2. To see the store from step 1 tied to UI, go to UI and open index.html in browser (no webserver is needed). The index.html only depends on index.js and nothing else.

3) UI-withRedux takes the code directory from step 2, deletes our store implementation and uses the Redux API. The UI is rendered using vanilla JS.

4) UI-withReduxAndReact directory takes some of the redux related code, store, actions, reducers and helper functions code from step 3 and renders UI using React and Redux. Finally UI is built using React and Redux is the store.

5) UI-ReactReduxAndAPI: example of using API to get/update data
