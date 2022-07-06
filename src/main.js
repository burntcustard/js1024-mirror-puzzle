navigator.mediaDevices.getUserMedia({'video': true})
  .then(mediaStream => {
    const d = document;
    const c = 'createElement';
    const p = parseInt;
    const grid = [];
    const w = 'width';
    const h = 'height';

    const setPositions = () => grid.map((g, i) =>
      // font-size: 0; fixes extra padding in mobile Safari
      g.style.cssText = `
        position: absolute;
        overflow: hidden;
        ${w}: 1in;
        ${h}: 1in;
        transition: all .4s;
        transform: translate(${i%3}in, ${~~(i/3)}in);
        font-size: 0;
        padding: 0;
      `
    );

    for (let i = 0; i < 9; i++) {
      // videoContainer is a button (with webcam video inside), or it's a gap <i>
      // because that's a single-letter HTML tagname with little semantic meaning
      let videoContainer = d[c](i < 8 ? 'button' : 'i');

      grid.push(videoContainer);
      videoContainer.i = i;
      a.append(videoContainer);

      if (i < 8) {
        const videoElement = d[c]('video');

        videoContainer.append(videoElement);
        videoElement.srcObject = mediaStream;

        // scaleX(-1) flips webcam around to make it "mirrored"
        videoElement.style.transform = `
          translate(-${i % 3}in, -${~~(i / 3)}in) scaleX(-1)
        `;

        videoElement.oncanplay = () => {
          videoElement.play();

          const computedStyle = getComputedStyle(videoElement);

          // Replaced with single assignmet with a ternary below
          // if (p(computedStyle.width) > p(computedStyle.height)) {
          //   videoElement.height = 288; // Approx 3in
          // } else {
          //   videoElement.width = 288; // Approx 3in
          // }

          videoElement[p(computedStyle[w]) > p(computedStyle[h]) ? h : w] = 288;
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
              b.innerText = 'Sorted! Try again?';
            }
          }
        };
      }
    }

    b.onclick = () => {
      grid.sort(() => Math.random() - 0.5);
      setPositions();
      b.innerText = 'Shuffle';
    }

    setPositions();
  });
