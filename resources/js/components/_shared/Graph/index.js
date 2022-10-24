import { motion } from 'framer-motion';

function Graph(props) {
    const pushBars = [];

    var bg = '#357F63';

    var width = 0;

    //calculate the proportion so that the highest number is 100
    const highestValue = Math.max(...props.data);
    const proportion = 100 / highestValue;

    props.data.forEach((bar, index) => {
        //determine if bar should be green or red
        if (bar > width) {
            bg = '#357F63';
        } else {
            bg = '#F4A3A3';
        }
        //set bar value to width to compare next time in the loop
        width = bar;

        //multiply the number by proportion to get a number not higher than 100
        const height = bar * proportion;

        pushBars.push(
            <motion.div
                key={index}
                className="graph-bar"
                animate={{ height: height + '%', backgroundColor: bg }}
                transition={{ duration: 0.5 + index / 8 }}
            ></motion.div>
        );
    });

    return <div className="graph">{pushBars}</div>;
}

export default Graph;
