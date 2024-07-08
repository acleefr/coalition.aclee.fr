# Coalition Simulator

This project is a JavaScript application that visualizes the distribution of political seats in a hemicycle SVG. Each political party's seats are represented as an arc in the hemicycle, with colors corresponding to each party.

## Features

- **Dynamic Visualization:** As you select checkboxes representing political parties and their seat counts, the hemicycle dynamically updates to reflect the proportional distribution of seats.
  
- **Majority Threshold Indicator:** The application displays whether the selected seats meet or exceed a predefined majority threshold.

## Technologies Used

- JavaScript
- D3.js (Data-Driven Documents) for SVG manipulation and visualization

## Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd seat-distribution-visualizer
   ```

2. **Open `index.html` in your web browser.**

   The application should automatically load and display the initial visualization.

## Usage

- **Checkbox Selection:** Check or uncheck checkboxes to include or exclude political parties from the visualization.
  
- **Visualization:** The hemicycle SVG updates in real-time to display arcs proportional to each selected party's seat count.

- **Majority Status:** Below the visualization, the application indicates whether the selected seats meet the majority threshold.

## Example

Suppose you have three political parties:
- Party A: 100 seats
- Party B: 150 seats
- Party C: 80 seats

If you check Party A and Party B:
- Party A's arc will represent 40% of the hemicycle (100 / (100 + 150))
- Party B's arc will represent 60% of the hemicycle (150 / (100 + 150))

The arcs dynamically adjust based on your selections.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or improvements, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.