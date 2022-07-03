navigator.mediaDevices.getUserMedia({'video': true})
  .then(mediaStream => {
    const d = document;
    const c = 'createElement';

    const setPositions = () => grid.map((g, i) =>
      // font-size: 0; fixes extra padding in mobile Safari
      g.style.cssText = `
        position: absolute;
        overflow: hidden;
        width: 1in;
        height: 1in;
        transition: all .4s;
        transform: translate(${i%3}in, ${~~(i/3)}in);
        font-size: 0;
        padding: 0;
      `
    )
    const grid = [];

    for (let i = 0; i < 9; i++) {
      let videoContainer = d[c](i < 8 ? 'button' : 'i');
      grid.push(videoContainer);
      videoContainer.i = i;
      a.append(videoContainer);
      if (i<8) {
        const videoElement = d[c]('video');

        videoContainer.append(videoElement);
        videoElement.srcObject = mediaStream;

        videoElement.style.transform = `
          translate(-${i % 3}in, -${~~(i / 3)}in) scaleX(-1)
        `;

        videoElement.oncanplay = () => {
          videoElement.play();

          const computedStyle = getComputedStyle(videoElement);

          if (computedStyle.width > computedStyle.height) {
            videoElement.height = 288;
          } else {
            videoElement.width = 288;
          }
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
            [grid[vIndex], grid[gIndex]] = [grid[gIndex], grid[vIndex]];
            setPositions();
            if (grid.every((elem, index) => elem.i === index)) {
              b.innerText = 'You win! Try again?';
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
