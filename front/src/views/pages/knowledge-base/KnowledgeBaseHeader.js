// ** Icons Imports
import { Search } from "react-feather";
import ReactTypingEffect from "react-typing-effect";

// ** Reactstrap Imports
import { Card, CardBody, CardText, Form, Input, InputGroup, InputGroupText, UncontrolledTooltip } from "reactstrap";

const FaqFilter = ({ searchTerm, setSearchTerm, searchCallback }) => {
  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    searchCallback(searchTerm);
  };

  return (
    <div id="knowledge-base-search">
      <Card
        className="knowledge-base-bg"
        style={{
          backgroundImage: `url('assets/images/banner/banner.png')`
        }}
      >
        <CardBody className="text-center">
          <h2 className="text-primary mb-2">Get your questions answered; with AI.</h2>
          <ReactTypingEffect
            speed={80}
            eraseSpeed={30}
            typingDelay={1000}
            eraseDelay={3000}
            text={[
              "Ask a question, get an answer 🚀.",
              "Millions of research articles and thousands of experts at your fingertips.",
              "Your very own Virtual Expert, to demystify the complex world of fitness.",
              "Get what's relevant to what you're looking for, hassle free."
            ]}
          />
          <div className="divider divider-primary divider-small"/>

          <Form className="kb-search-input mb-2" onSubmit={onSubmit}>
            <InputGroup className="input-group-merge">
              <InputGroupText>
                <Search size={14} />
              </InputGroupText>
              <Input value={searchTerm} onChange={onChange} placeholder="Ask a question..." />
            </InputGroup>
          </Form>
          <p className="text-muted mt-1">Powered by&nbsp;
            <a className="text-primary text-decoration-underline" href="https://github.com/TheRealMkadmi/pi-dev-twin/blob/main/ReadMe-CrystalSpider.md" target="_blank">CrystalSpider ™️</a>
            &nbsp;&&nbsp;
            <span className="text-primary text-decoration-underline" id="crystal-gpt-info">CrystalGPT ™️</span>
            , a next generation Large Language Model.</p>
          <UncontrolledTooltip placement="bottom" target="crystal-gpt-info">
            CrystalGPT is an in-house Large Language Model, built with cutting edge technology (Llama Index, GPT and
            LangChain), trained on a large corpus of fitness related data.
          </UncontrolledTooltip>
        </CardBody>
      </Card>
    </div>
  );
};

export default FaqFilter;
