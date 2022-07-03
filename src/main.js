navigator.mediaDevices.getUserMedia({'video': true})
  .then(mediaStream => {
    const setPositions = () => grid.map((g, i) =>
      g.style.cssText = `
        position: absolute;
        overflow: hidden;
        width: 1in;
        height: 1in;
        transition: all .5s;
        margin-top: ${~~(i/3)}in;
        margin-left: ${i%3}in;
        padding: 0;
      `
    )
    let grid = [];

    for (let i = 0; i < 9; i++) {
      let videoContainer = document.createElement('button');
      grid.push(videoContainer);
      videoContainer.i = i;
      a.append(videoContainer);
      if (i<8) {
        let videoElement = document.createElement('video');
        videoContainer.append(videoElement);
        videoElement.srcObject = mediaStream;
        videoElement.height = 300;
        videoElement.style.marginTop = `${(~~(i/3)) * -1}in`;
        videoElement.style.marginLeft = `${(i % 3) * -1}in`;
        videoElement.style.transform = 'scaleX(-1)';
        videoElement.oncanplay = () => videoElement.play();
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
              b.innerText = 'Congrats, you win! Try again?';
            }
          }
        };
      }
    }

    b.onclick = () => {
      grid.sort(() => Math.random() - 0.5);
      setPositions();
      b.innerText = 'Reshuffle';
    }

    setPositions();
  });
