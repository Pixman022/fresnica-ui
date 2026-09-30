# Third-party notices

The MIT License in [`LICENSE`](./LICENSE) applies to Fresnica UI's project-owned
source code and documentation. The following third-party packages and bundled
fonts keep their own licenses.

## Runtime and bundled assets

| Dependency                                                        | Use                                    | License                   | Notice/source                                            |
| ----------------------------------------------------------------- | -------------------------------------- | ------------------------- | -------------------------------------------------------- |
| [`lucide-react`](https://github.com/lucide-icons/lucide)          | Interface icons                        | ISC                       | Package license is included in the installed dependency. |
| [`@fontsource/roboto`](https://github.com/fontsource/fonts)       | Roboto webfont files                   | SIL Open Font License 1.1 | See the package's `OFL.txt`.                             |
| [`@fontsource/noto-sans-sc`](https://github.com/fontsource/fonts) | Simplified Chinese fallback font files | SIL Open Font License 1.1 | See the package's `OFL.txt`.                             |

The Fresnica logo, application icon, tab-bar artwork and banner images are
original project assets. The project owner has confirmed that they may be
publicly distributed. If an asset is replaced with a third-party asset, record
its source and license here and keep its license terms alongside the asset.

## Development-only dependencies

Build, test and documentation tooling remains governed by the licenses declared
by each package in `package-lock.json`; these dependencies are not part of the
runtime component package unless they are explicitly bundled by a build.

This inventory is maintained as a release checklist. Re-run the dependency
license review after adding a package or changing bundled assets.
