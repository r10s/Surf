# Surf

The *Let's Surf* game from ``edge://surf`` ported to WebXDC

The game is created by Microsoft – please see the **Credits** in the game menu for more information. The files in this repo are from Microsoft Edge; however, some of them have been modified so the game can function independently from Edge and use the features of WebXDC.

## Developing

### Installing Dependencies

After cloning this repo, install dependecies:

```
pnpm i
```

### Testing the app in the browser

To test your work in your browser while developing:

```
pnpm start
```

### Building

To package the WebXDC file:

```
pnpm build
```

The resulting optimized `.xdc` file is saved in the current working directory.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag -a v1.0.1
git push origin v1.0.1
```
