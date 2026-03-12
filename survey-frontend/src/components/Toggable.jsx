import { useState, useImperativeHandle, forwardRef } from "react";

const Toggable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    }

    useImperativeHandle(ref, () => ({
        toggleVisibility
    }));

    return (
        <div>
            <div style={hideWhenVisible}>
                <button className="btn btn-outline-light" onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible} className="toggable-popup">
                {props.children}
                <div className="mt-2 d-flex justify-content-end">
                  <button className="btn btn-sm btn-outline-light" onClick={toggleVisibility}>cancel</button>
                </div>
            </div>
        </div>
    );
});

export default Toggable;