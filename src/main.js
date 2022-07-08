navigator.mediaDevices.getUserMedia({'video': true})
  .then(mediaStream => {
    const grid = [];

    const setPositions = () => grid.map((g, i) =>
      // font-size: 0; fixes extra padding in mobile Safari
      g.style.cssText = `
        height: 1in;
        width: 1in;
        position: fixed;
        overflow: hidden;
        transition: all .3s;
        transform: translate(${i%3}in, ${~~(i/3)}in);
        font-size: 0;
        padding: 0;
      `
    );

    let outer = document.createElement('div');
    let inner = document.createElement('div');
    let shuffleButton = document.createElement('button');

    a.append(outer);
    outer.append(inner, shuffleButton);

    outer.style.cssText = 'width:3in;background:#7dd;border:2ex solid #7dd;border-radius:2ex;display:grid;gap:4ex;box-shadow:0 0 1ex #1785;margin:3em auto';
    inner.style.cssText = 'height:3in;box-shadow:0 0 1ex #178 inset;filter:drop-shadow(0 0 1ex #178)';
    shuffleButton.style.cssText = 'height:3em;box-shadow:0 0 1ex #1785';
    shuffleButton.innerText = 'Shuffle';

    for (let i = 0; i < 9; i++) {
      // videoContainer is a button (with webcam video inside), or it's a gap <i>
      // because that's a single-letter HTML tagname with little semantic meaning
      let videoContainer = document.createElement(i < 8 ? 'button' : 'i');

      grid.push(videoContainer);
      videoContainer.i = i;
      inner.append(videoContainer);

      if (i < 8) {
        const videoElement = document.createElement('video');

        videoContainer.append(videoElement);
        videoElement.srcObject = mediaStream;

        // scaleX(-1) flips webcam around to make it "mirrored"
        videoElement.style.cssText = `
          transform:translate(-${i % 3}in, -${~~(i / 3)}in) scaleX(-1)
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
          let gIndex = grid.findIndex(item => item.i === 8);

          if (
            vIndex > 2 && grid[vIndex - 3].i === 8 ||
            vIndex < 6 && grid[vIndex + 3].i === 8 ||
            vIndex % 3 > 0 && grid[vIndex - 1].i === 8 ||
            vIndex % 3 < 2 && grid[vIndex + 1].i === 8
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

    shuffleButton.onclick = () => {
      grid.sort(() => Math.random() - 0.5);
      setPositions();
      shuffleButton.innerText = 'Shuffle';
    }

    setPositions();
  });
