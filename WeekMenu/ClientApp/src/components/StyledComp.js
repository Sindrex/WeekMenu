import React, { Component } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
    color: blue;
`;

export class StyledComp extends Component {
    render() {
        return (
            <StyledDiv>this is styled</StyledDiv>
        );
    }
}
