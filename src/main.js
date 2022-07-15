const grid = [];
const outer = document.createElement('div');
const inner = document.createElement('div');
const shuffleButton = document.createElement('button');

const setPositions = () => grid.map((videoContainer, i) =>
  // font-size: 0; fixes extra padding in mobile Safari
  videoContainer.style.cssText = `
    height: 1in;
    width: 1in;
    position: fixed;
    overflow: hidden;
    transition: all .3s;
    transform: translate(${i % 3}in, ${i / 3 | 0}in);
    font-size: 0;
    padding: 0;
  `
);

b.append(outer);
outer.append(inner, shuffleButton);

outer.style.cssText = 'width:3in;background:#7dd;border:2ex solid #7dd;border-radius:2ex;display:grid;gap:4ex;box-shadow:0 0 1ex #1785;margin:3em auto';
inner.style.cssText = 'height:3in;box-shadow:0 0 1ex #178 inset;filter:drop-shadow(0 0 1ex #178)';
shuffleButton.style.cssText = 'height:3em;box-shadow:0 0 1ex #1785';
shuffleButton.disabled = true;
shuffleButton.innerText = 'Loading camera…';

shuffleButton.onclick = () => {
  grid.sort(() => Math.random() - 0.5);
  setPositions();
  shuffleButton.innerText = 'Shuffle';
}

navigator.mediaDevices.getUserMedia({'video': true})
  .then(mediaStream => {
    for (let i = 0; i < 9; i++) {
      // videoContainer is a button (with webcam video inside), or it's a gap <i>
      // because that's a single-letter HTML tagname with little semantic meaning
      const videoContainer = document.createElement(i < 8 ? 'button' : 'div');

      // We don't actually use the video element unless i < 8, but having it declared
      // next to the videoContainer, rather than in the if(), saves a few bytes
      const videoElement = document.createElement('video');

      grid.push(videoContainer);
      videoContainer.i = i;
      inner.append(videoContainer);

      if (i < 8) {
        videoContainer.append(videoElement);
        videoElement.srcObject = mediaStream;

        // scaleX(-1) flips webcam around to make it "mirrored"
        videoElement.style.cssText = `
          transform:translate(-${i % 3}in, -${i / 3 | 0}in) scaleX(-1)
        `;

        videoElement.oncanplay = () => {
          videoElement.play();
          // Replaced with single assignmet with a ternary below
          // if (p(computedStyle.width) > p(computedStyle.height)) {
          //   videoElement.height = 288; // Approx 3in
          // } else {
          //   videoElement.width = 288; // Approx 3in
          // }

          videoElement[parseInt(getComputedStyle(videoElement).width) > parseInt(getComputedStyle(videoElement).height) ? 'height' : 'width'] = 288;
        }

        videoContainer.onclick = () => {
          let vIndex = grid.indexOf(videoContainer);
          let gIndex = grid.findIndex(item => item.i & 8);

          if (
            vIndex - gIndex == -3 |
            vIndex - gIndex == 3 |
            vIndex - gIndex == -1 & vIndex % 3 < 2 |
            vIndex - gIndex == 1 & vIndex % 3 > 0
          ) {
            // Swap clicked video container and empty container grid item
            [grid[vIndex], grid[gIndex]] = [grid[gIndex], grid[vIndex]];

            setPositions();

            // If every item in the grid is in order, they're arranged correctly
            if (grid.every((elem, index) => elem.i === index)) {
              shuffleButton.innerText = 'Sorted! Try again?';
            }
          }
        };
      }
    }

    setPositions();
    shuffleButton.innerText = 'Shuffle';
    shuffleButton.disabled = false;
  });
