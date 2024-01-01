import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#00A6A6" // Persian Green
		},
		secondary: {
			main: "#57A0D3" // Carolina Blue
		},
		tertiary: {
			main: "#FFAA4C" // Bright Yellow (Crayola)
		},
		text: {
			primary: "#343434" // Jet
		},
		background: {
			default: "#f7f8f8" // A light gray
		}
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			textAlign: "center"
		},
		h5: {
			textAlign: "center"
		},
		h6: { textAlign: "center" },
		body1: {
			textAlign: "center"
		}
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					// Applied to every Button component
					borderRadius: "8px",
					textTransform: "none",
					padding: "10px 20px",
					margin: "5px" // Adds spacing around the buttons
				},
				containedPrimary: {
					// Specifically for primary variant
					"backgroundColor": "#00A6A6", // Use primary color
					"&:hover": {
						backgroundColor: "#008080" // Slightly shaded on hover
					},
					"color": "white"
				},
				containedSecondary: {
					// Specifically for secondary variant
					"backgroundColor": "#57A0D3", // Use secondary color
					"&:hover": {
						backgroundColor: "#3a8db3" // Slightly shaded on hover
					},
					"color": "white"
				},
				containedTertiary: {
					// Add a style for tertiary buttons
					"backgroundColor": "#FFAA4C", // Use tertiary color
					"&:hover": {
						backgroundColor: "#DD9933" // Slightly shaded on hover
					}
				},
				text: {
					"&:hover": {
						textDecoration: "none",

						backgroundColor: "#008080"
					},
					"&.active": {
						color: "#DD9933" // active link color
						// other active styles
					},
					"textAlign": "center",
					"textDecoration": "none",
					"color": "white",
					// "margin": "0 1rem",
					"fontSize": "1.5rem"
				}
			}
		},
		MuiTypography: {
			styleOverrides: {
				h1: {
					fontSize: "2rem",
					fontWeight: "bold",
					color: "#343434" // Jet
				},
				body1: {
					fontSize: "1rem",
					color: "#343434"
				},
				h5: {
					marginBottom: 1,
					fontWeight: "normal"
				},
				h6: {
					fontSize: "1rem"
				}
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
					borderRadius: "10px",
					padding: "20px"
				}
			}
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					// Set default width for all forms
					// "maxWidth": "sm",
					// "@media (min-width: 600px)": {
					// 	// sm breakpoint
					// 	width: "400px"
					// },
					margin: "auto" // Center the form
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& label.Mui-focused": {
						color: "#00A6A6" // Persian Green
					},
					"& .MuiInput-underline:after": {
						borderBottomColor: "#00A6A6"
					},
					"& .MuiInput-underline:before": {
						borderBottomColor: "#00A6A6 "
					},
					"& .MuiOutlinedInput-root": {
						"&:not(:hover):not(:focus) fieldset": {
							border: "none"
						},
						"&:hover fieldset": {
							borderColor: "#57A0D3" // Carolina Blue
							// border: "none"
						},
						"&.Mui-focused fieldset": {
							borderColor: "#00A6A6"
							// border: "none"
						}
					}
				}
			}
		},
		MuiInput: {
			styleOverrides: {
				underline: {
					"&:before": {
						borderBottom: "none"
					},
					"&:after": {
						borderBottom: "none"
					},
					"&:hover:not(.Mui-disabled):before": {
						borderBottom: "none"
					}
				}
			}
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#00A6A6", // Persian Green
					color: "#FFF0F5" // Lavender Blush
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: `
                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                code {
                    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
                }
            `
		}
	}
});

export default theme;
