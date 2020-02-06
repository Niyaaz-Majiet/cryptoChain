import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';


class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch('http://localhost:3000/api/blocks')
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    blocks: json
                })
            });
    }

    render() {
        return (
            <div>
                <div><Link to="/">Home</Link></div>  
                <br />
                <h3>Blocks</h3>
                {
                    this.state.blocks.map((block) => {
                        return (
                            <Block key={block.hash} block={block} >{block.hash}</Block>
                        );
                    })
                }
            </div>
        );
    }
}

export default Blocks;
