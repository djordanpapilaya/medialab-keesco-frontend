import refdef from 'lib/ReferenceDefinitions';
import IResult from 'lib/temple/core/IResult';

interface ISocketResult<TData, TCode> extends IResult<TData>
{
	code?:TCode;
}

export default ISocketResult;