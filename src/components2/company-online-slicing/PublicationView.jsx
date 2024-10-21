import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";

const PublicationViewModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle fontSize={"1em"}>View Config</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Source Company:</strong> 3M
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Destination Company:</strong> 3M INDIA
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Publication Type:</strong>
            </Typography>
            <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
              123telugu.com, 60secondsnow.com, 91mobiles.com, Afaqs.com,
              BestMediainfo.com, Indiantelevision.com, Newkerala.com,
              ONEINDIA.COM, Scmp.Com, Tribuneindia.com, aaj.tv, aajkikhabar.com,
              aajsamaaj.com, aajtak.intoday.in, aanavandi.com, abplive.in,
              abpnews.abplive.in, adigitalblogger.com, admaya.in, adpress.in,
              adya.news, afaqs.com, afternoondc.in, afternoonvoice.com,
              akhandbharatnews.com, akilanews.com, allindianews24x7.in,
              allindiaroundup.com, allindiatimes.com, alphaideas.in,
              amarujala.com, amarvani.news, analyticsindiamag.com,
              anandabazar.com, andhrabhoomi.net, andhraheadlines.com,
              andhrajyothy.com, andhravijayam.com, andhrawishesh.com,
              angrejinews.com, aninews.in, apherald.com, aplatestnews.com,
              arunachal24.in, arunachaltimes.in, asianage.com, asianetindia.com,
              asomiyapratidin.in, autocarindia.com, autocarpro.in,
              automotive-technology.com
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PublicationViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PublicationViewModal;
